package me.ptakondrej.minieshop.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.minieshop.auth.RefreshToken;
import me.ptakondrej.minieshop.models.LoginDataDTO;
import me.ptakondrej.minieshop.models.LoginUserDTO;
import me.ptakondrej.minieshop.models.RegisterUserDTO;
import me.ptakondrej.minieshop.models.UserDTO;
import me.ptakondrej.minieshop.responses.LoginResponse;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.AuthService;
import me.ptakondrej.minieshop.services.JwtService;
import me.ptakondrej.minieshop.services.RefreshTokenService;
import me.ptakondrej.minieshop.services.UserService;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	private final JwtService jwtService;
	private final RefreshTokenService refreshTokenService;
	private final UserService userService;

	public AuthController(AuthService authService, JwtService jwtService, RefreshTokenService refreshTokenService, UserService userService) {
		this.authService = authService;
		this.jwtService = jwtService;
		this.refreshTokenService = refreshTokenService;
		this.userService = userService;
	}

	@PostMapping("/signup")
	public ResponseEntity<Response<UserDTO>> signUp(@RequestBody RegisterUserDTO registerUserDTO) {
		try {
			if (registerUserDTO == null || registerUserDTO.getEmail() == null || registerUserDTO.getPassword() == null) {
				return ResponseEntity.badRequest().body(new Response<UserDTO>(false, null, "Invalid registration data."));
			}

			User user = authService.signUp(registerUserDTO);
			UserDTO userDTO = UserMapper.convertToDto(user);

			return ResponseEntity.ok(new Response<UserDTO>(true, userDTO, "Registration successful. Please verify your email."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new Response<UserDTO>(false, null, e.getMessage()));
		}
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDTO loginUserDTO, HttpServletResponse response) {
		try {
			User authenticatedUser = authService.authenticate(loginUserDTO);
			HashMap<String, Object> userDetails = authService.createUserDetails(authenticatedUser);
			String token = jwtService.generateToken(userDetails, authenticatedUser);
			UserDTO userDTO = UserMapper.convertToDto(authenticatedUser);
			RefreshToken refreshToken = refreshTokenService.createRefreshToken(authenticatedUser);

			authService.setCookies(response, token, refreshToken.getToken());

			return ResponseEntity.ok(new LoginResponse(
					true,
					new LoginDataDTO(userDTO),
					"Login successful"
			));

		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new LoginResponse(false, new LoginDataDTO(null),  e.getMessage()));
		}
	}

	@PostMapping("/refresh-token")
	public ResponseEntity<LoginResponse> refreshToken(@CookieValue(value = "refreshToken") String refreshToken, HttpServletResponse response) {
		System.out.println("Received refresh token: " + refreshToken);
		try {
			RefreshToken oldRefreshToken = refreshTokenService
					.findByToken(refreshToken)
					.map(refreshTokenService::verifyExpiration)
					.orElseThrow(() -> new RuntimeException("Invalid refresh token."));

			User user = oldRefreshToken.getUser();
			refreshTokenService.deleteByOldRefreshToken(oldRefreshToken.getToken());
			RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);
			HashMap<String, Object> userDetails = authService.createUserDetails(user);
			String newAccessToken = jwtService.generateToken(userDetails, user);
			UserDTO userDTO = UserMapper.convertToDto(user);

			authService.setCookies(response, newAccessToken, newRefreshToken.getToken());

			return ResponseEntity.ok(new LoginResponse(
					true,
					new LoginDataDTO(
							userDTO),
					"Token refreshed successfully"
			));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new LoginResponse(false, new LoginDataDTO(null), e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new LoginResponse(false, new LoginDataDTO(null), "An error occurred while refreshing the token."));
		}
	}

	@DeleteMapping("/logout")
	public ResponseEntity<Response<String>> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken, HttpServletResponse response) {
		try {
			if (refreshToken != null) {
				System.out.println("Deleting refresh token: " + refreshToken);
				refreshTokenService.deleteByOldRefreshToken(refreshToken);
			}

			Cookie jwtCookie = new Cookie("accessToken", null);
			jwtCookie.setHttpOnly(true);
			jwtCookie.setPath("/");
			jwtCookie.setMaxAge(0);
			jwtCookie.setSecure(true);
			response.addCookie(jwtCookie);

			Cookie refreshTokenCookie = new Cookie("refreshToken", null);
			refreshTokenCookie.setHttpOnly(true);
			refreshTokenCookie.setPath("/");
			refreshTokenCookie.setMaxAge(0);
			refreshTokenCookie.setSecure(true);
			response.addCookie(refreshTokenCookie);

			response.setHeader("Set-Cookie",
					"accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None");

			response.setHeader("Set-Cookie",
					"refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None");

			return ResponseEntity.ok(new Response<String>(true, null, "Logged out successfully."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new Response<String>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<String>(false, null, "An error occurred during logout."));
		}
	}

	@GetMapping("/me")
	public ResponseEntity<Response<UserDTO>> getCurrentUser(@RequestAttribute Long userId) {
		try {
			if (userId == null) {
				return ResponseEntity.status(401).body(new Response<UserDTO>(false, null, "Unauthorized"));
			}
			User user = userService.findById(userId);
			UserDTO userDTO = UserMapper.convertToDto(user);
			return ResponseEntity.ok(new Response<UserDTO>(true, userDTO, "User retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(404).body(new Response<UserDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<UserDTO>(false, null, "An error occurred while retrieving the user: " + e.getMessage()));
		}
	}
}
