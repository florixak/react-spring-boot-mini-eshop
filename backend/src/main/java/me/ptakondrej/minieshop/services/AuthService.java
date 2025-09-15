package me.ptakondrej.minieshop.services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.minieshop.models.LoginUserDTO;
import me.ptakondrej.minieshop.models.RegisterUserDTO;
import me.ptakondrej.minieshop.user.Role;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

	public AuthService(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, WishlistService wishlistService, JwtService jwtService, RefreshTokenService refreshTokenService) {
		this.userRepository = userRepository;
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.wishlistService = wishlistService;
		this.jwtService = jwtService;
		this.refreshTokenService = refreshTokenService;
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
