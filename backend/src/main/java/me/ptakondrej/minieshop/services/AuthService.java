package me.ptakondrej.minieshop.services;

import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.minieshop.models.*;
import me.ptakondrej.minieshop.user.Role;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final UserService userService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final WishlistService wishlistService;
	private final JwtService jwtService;
	private final RefreshTokenService refreshTokenService;
	private final EmailService emailService;

	public AuthService(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, WishlistService wishlistService, JwtService jwtService, RefreshTokenService refreshTokenService, EmailService emailService) {
		this.userRepository = userRepository;
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.wishlistService = wishlistService;
		this.jwtService = jwtService;
		this.refreshTokenService = refreshTokenService;
		this.emailService = emailService;
	}

	@Transactional
	public User signUp(RegisterUserDTO registerUserDTO) {
		User user = User.builder()
				.username(registerUserDTO.getUsername())
				.password(passwordEncoder.encode(registerUserDTO.getPassword()))
				.email(registerUserDTO.getEmail())
				.firstName(registerUserDTO.getFirstName())
				.lastName(registerUserDTO.getLastName())
				.deleted(false)
				.role(Role.USER)
				.enabled(true)
				.verified(false)
				.verificationCode(generateVerificationCode())
				.verificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15))
				.build();
		User createdUser = userRepository.save(user);
		wishlistService.createWishlist(user.getId());

		try {
			emailService.sendVerificationEmail(createdUser);
		} catch (Exception e) {
			throw new RuntimeException("Failed to send verification email", e);
		}
		
		return createdUser;
	}

	@Transactional
	public User authenticate(LoginUserDTO loginUserDTO) {

		if (loginUserDTO.getUsernameOrEmail() == null || loginUserDTO.getPassword() == null) {
			throw new RuntimeException("Email and password must not be null.");
		}

		User user = userService.findByEmailOrUsername(loginUserDTO.getUsernameOrEmail())
				.orElseThrow(() -> new RuntimeException("User not found with email or username: " + loginUserDTO.getUsernameOrEmail()));

		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginUserDTO.getUsernameOrEmail(),
				loginUserDTO.getPassword()));

		return user;
	}

	public HashMap<String, Object> createUserDetails(User user) {
		HashMap<String, Object> userDetails = new HashMap<>();
		userDetails.put("id", user.getId());
		userDetails.put("username", user.getUsername());
		userDetails.put("email", user.getEmail());
		userDetails.put("enabled", user.isEnabled());
		userDetails.put("role", user.getRole().name());
		return userDetails;
	}

	@Transactional
	public void verifyUser(VerifyUserDTO verifyUserDTO) {
		User user = userRepository.findByEmail(verifyUserDTO.getEmail())
				.orElseThrow(() -> new RuntimeException("User not found with email: " + verifyUserDTO.getEmail()));

		if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Verification code has expired.");
		}

		if (!user.getVerificationCode().equals(verifyUserDTO.getVerificationCode())) {
			throw new RuntimeException("Invalid verification code.");
		}

		user.setVerificationCode(null);
		user.setVerificationCodeExpiresAt(null);
		user.setVerified(true);
		userRepository.save(user);
	}

	@Transactional
	public void resendVerificationEmail(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));

		if (user.isVerified()) {
			throw new RuntimeException("User account is already verified.");
		}

		user.setVerificationCode(generateVerificationCode());
		user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
		try {
			emailService.sendVerificationEmail(user);
		} catch (Exception e) {
			user.setVerificationCode(null);
			user.setVerificationCodeExpiresAt(null);
			throw new RuntimeException("Failed to send verification email", e);
		} finally {
			userRepository.save(user);
		}
	}

	@Transactional
	public void requestPasswordReset(PasswordResetRequestDTO dto) {
		userRepository.findByEmail(dto.getEmail()).ifPresent(user -> {
			user.setPasswordResetToken(generatePasswordResetToken());
			user.setPasswordResetTokenExpiresAt(LocalDateTime.now().plusMinutes(30));
			try {
				emailService.sendPasswordResetEmail(user);
			} catch (Exception e) {
				user.setPasswordResetToken(null);
				user.setPasswordResetTokenExpiresAt(null);
				throw new RuntimeException("Failed to send password reset email", e);
			} finally {
				userRepository.save(user);
			}
		});
	}

	@Transactional
	public void resendPasswordResetEmail(PasswordResetRequestDTO dto) {
		requestPasswordReset(dto);
	}

	@Transactional
	public void resetPassword(PasswordResetDTO dto) {
		User user = userRepository.findByPasswordResetToken(dto.getToken())
				.orElseThrow(() -> new RuntimeException("Invalid or expired password reset token."));

		if (user.getPasswordResetTokenExpiresAt() == null || user.getPasswordResetTokenExpiresAt().isBefore(LocalDateTime.now())) {
			throw new RuntimeException("Invalid or expired password reset token.");
		}

		if (dto.getNewPassword().length() < 8) {
			throw new IllegalArgumentException("Password must be at least 8 characters long");
		}

		if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
			throw new IllegalArgumentException("New password must be different from the current password");
		}

		user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
		user.setPasswordResetToken(null);
		user.setPasswordResetTokenExpiresAt(null);
		userRepository.save(user);

		refreshTokenService.deleteAllByUserId(user.getId());
	}

	@Transactional(readOnly = true)
	public boolean isPasswordResetTokenValid(String token) {
		return userRepository.findByPasswordResetToken(token)
				.map(user -> user.getPasswordResetTokenExpiresAt() != null && user.getPasswordResetTokenExpiresAt().isAfter(LocalDateTime.now()))
				.orElse(false);
	}

	private String generatePasswordResetToken() {
		SecureRandom random = new SecureRandom();
		byte[] bytes = new byte[24];
		random.nextBytes(bytes);
		String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
		final int maxAttempts = 1000;
		int attempts = 0;
		while (userRepository.existsByPasswordResetToken(token)) {
			if (++attempts > maxAttempts) {
				throw new RuntimeException("Unable to generate unique password reset token");
			}
			random.nextBytes(bytes);
			token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
		}
		return token;
	}

	private String generateVerificationCode() {
		SecureRandom random = new SecureRandom();
		String code;
		final int maxAttempts = 10000;
		int attempts = 0;

		do {
			int randomCode = 100000 + random.nextInt(900000); // 100000..999999
			code = String.format("%06d", randomCode);
			if (++attempts > maxAttempts) {
				throw new RuntimeException("Unable to generate unique verification code after " + maxAttempts + " attempts");
			}
		} while (userRepository.existsByVerificationCode(code));

		return code;
	}

	public void setCookies(HttpServletResponse response, String token, String refreshToken) {

		int jwtDurationSeconds = (int) (jwtService.getExpirationTime() / 1000);
		int refreshTokenDurationSeconds = (int) (refreshTokenService.getRefreshTokenDurationMs() / 1000);

		response.addHeader("Set-Cookie",
				"accessToken=" + token + "; HttpOnly; Path=/; Max-Age=" + jwtDurationSeconds + "; SameSite=None; Secure");

		response.addHeader("Set-Cookie",
				"refreshToken=" + refreshToken + "; HttpOnly; Path=/; Max-Age=" + refreshTokenDurationSeconds + "; SameSite=None; Secure");
	}

	public void clearCookies(HttpServletResponse response) {
		response.addHeader("Set-Cookie",
				"accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure");

		response.addHeader("Set-Cookie",
				"refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure");
	}
















}
