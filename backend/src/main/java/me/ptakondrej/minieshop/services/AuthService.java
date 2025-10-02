package me.ptakondrej.minieshop.services;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.minieshop.models.LoginUserDTO;
import me.ptakondrej.minieshop.models.RegisterUserDTO;
import me.ptakondrej.minieshop.models.VerifyUserDTO;
import me.ptakondrej.minieshop.user.Role;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Random;

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
		try {
			wishlistService.createWishlist(user.getId());
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		emailService.sendVerificationEmail(createdUser);
		return createdUser;
	}

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

	public void resendVerificationEmail(String email) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("User not found with email: " + email));

		if (user.getVerificationCode() == null) {
			throw new RuntimeException("User account is already verified.");
		}

		user.setVerificationCode(generateVerificationCode());
		user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
		userRepository.save(user);
		emailService.sendVerificationEmail(user);
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
		Cookie jwtCookie = new Cookie("accessToken", token);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setPath("/");
		jwtCookie.setSecure(true);
		jwtCookie.setMaxAge((int) (jwtService.getExpirationTime() / 1000));
		response.addCookie(jwtCookie);

		Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setSecure(true);
		refreshTokenCookie.setMaxAge((int) (refreshTokenService.getRefreshTokenDurationMs() / 1000));
		response.addCookie(refreshTokenCookie);

		response.setHeader("Set-Cookie",
				"accessToken=" + token + "; HttpOnly; Path=/; Max-Age=" + (jwtService.getExpirationTime() / 1000) + "; SameSite=None; Secure");

		response.addHeader("Set-Cookie",
				"refreshToken=" + refreshToken + "; HttpOnly; Path=/; Max-Age=" + (refreshTokenService.getRefreshTokenDurationMs() / 1000) + "; SameSite=None; Secure");
	}

	public void clearCookies(HttpServletResponse response) {
		Cookie jwtCookie = new Cookie("accessToken", null);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setPath("/");
		jwtCookie.setSecure(true);
		jwtCookie.setMaxAge(0);
		response.addCookie(jwtCookie);

		Cookie refreshTokenCookie = new Cookie("refreshToken", null);
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setSecure(true);
		refreshTokenCookie.setMaxAge(0);
		response.addCookie(refreshTokenCookie);

		response.addHeader("Set-Cookie",
				"accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure");

		response.addHeader("Set-Cookie",
				"refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None; Secure");
	}
















}
