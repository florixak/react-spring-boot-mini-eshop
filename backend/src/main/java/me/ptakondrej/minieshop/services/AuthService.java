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
				.build();
		User createdUser = userRepository.save(user);
		wishlistService.createWishlist(user.getId());
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
		sendVerificationEmail(user);
	}

	public void sendVerificationEmail(User user) {
		String subject = "Account Verification";
		String verificationCode = "VERIFICATION CODE " + user.getVerificationCode();
		String htmlMessage = "<html>"
				+ "<body style=\"font-family: Arial, sans-serif;\">"
				+ "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
				+ "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
				+ "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
				+ "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
				+ "<h3 style=\"color: #333;\">Verification Code:</h3>"
				+ "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
				+ "</div>"
				+ "</div>"
				+ "</body>"
				+ "</html>";
		try {
			emailService.sendEmail(user.getEmail(), subject, htmlMessage);
		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

	private String generateVerificationCode() {
		Random random = new Random();
		String code;
		do {
			int randomCode = random.nextInt(999999) + 100000;
			code = String.format("%06d", randomCode);
		} while (userRepository.existsByVerificationCode(code));
		return code;
	}

	public void setCookies(HttpServletResponse response, String token, String refreshToken) {
		Cookie jwtCookie = new Cookie("accessToken", token);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setPath("/");
		jwtCookie.setSecure(false);
		jwtCookie.setMaxAge((int) (jwtService.getExpirationTime() / 1000));
		response.addCookie(jwtCookie);

		Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setSecure(false);
		refreshTokenCookie.setMaxAge((int) (refreshTokenService.getRefreshTokenDurationMs() / 1000));
		response.addCookie(refreshTokenCookie);

		response.setHeader("Set-Cookie",
				"accessToken=" + token + "; HttpOnly; Path=/; Max-Age=" + (jwtService.getExpirationTime() / 1000) + "; SameSite=Lax");

		response.addHeader("Set-Cookie",
				"refreshToken=" + refreshToken + "; HttpOnly; Path=/; Max-Age=" + (refreshTokenService.getRefreshTokenDurationMs() / 1000) + "; SameSite=Lax");
	}

	public void clearCookies(HttpServletResponse response) {
		Cookie jwtCookie = new Cookie("accessToken", null);
		jwtCookie.setHttpOnly(true);
		jwtCookie.setPath("/");
		jwtCookie.setSecure(false);
		jwtCookie.setMaxAge(0);
		response.addCookie(jwtCookie);

		Cookie refreshTokenCookie = new Cookie("refreshToken", null);
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setPath("/");
		refreshTokenCookie.setSecure(false);
		refreshTokenCookie.setMaxAge(0);
		response.addCookie(refreshTokenCookie);

		response.setHeader("Set-Cookie",
				"accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");

		response.addHeader("Set-Cookie",
				"refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
	}
















}
