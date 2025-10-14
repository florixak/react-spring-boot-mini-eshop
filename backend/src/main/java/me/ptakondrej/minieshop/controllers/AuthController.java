package me.ptakondrej.minieshop.controllers;

import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.minieshop.auth.RefreshToken;
import me.ptakondrej.minieshop.models.*;
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
				refreshTokenService.deleteByOldRefreshToken(refreshToken);
			}

			authService.clearCookies(response);

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

	@GetMapping("/verify")
	public ResponseEntity<Response<String>> verifyEmail(@RequestParam String token, @RequestParam(required = false) String email) {
		try {
			if (token == null || token.isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<String>(false, null, "Verification code must not be null or empty."));
			}
			if (email == null || email.isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<String>(false, null, "Email must not be null or empty."));
			}
			VerifyUserDTO verifyUserDTO = new VerifyUserDTO(token, email);
			authService.verifyUser(verifyUserDTO);
			return ResponseEntity.ok(new Response<String>(true, null, "Email verified successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<String>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<String>(false, null, "An error occurred during email verification: " + e.getMessage()));
		}
	}

	@PostMapping("/resend-verification")
	public ResponseEntity<Response<String>> resendVerificationEmail(@RequestBody EmailRequestDTO emailRequestDTO) {
		try {
			String email = emailRequestDTO.getEmail();
			if (email == null || email.isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<String>(false, null, "Email must not be null or empty."));
			}
			authService.resendVerificationEmail(email);
			return ResponseEntity.ok(new Response<String>(true, null, "Verification email resent successfully."));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<String>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<String>(false, null, "An error occurred while resending verification email: " + e.getMessage()));
		}
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<Response<String>> forgotPassword(@RequestBody PasswordResetRequestDTO prRequestDTO) {
		try {
			if (prRequestDTO == null || prRequestDTO.getEmail() == null || prRequestDTO.getEmail().isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<String>(false, null, "Email must not be null or empty."));
			}
			authService.requestPasswordReset(prRequestDTO);

			return ResponseEntity.ok(new Response<String>(true, null, "If an account with that email exists, a password reset link has been sent."));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<String>(false, null, "An error occurred while processing password reset request."));
		}
	}

	@PostMapping("/resend-password-reset")
	public ResponseEntity<Response<String>> resendPasswordResetEmail(@RequestBody PasswordResetRequestDTO prRequestDTO) {
		try {
			if (prRequestDTO == null || prRequestDTO.getEmail() == null || prRequestDTO.getEmail().isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<String>(false, null, "Email must not be null or empty."));
			}
			authService.resendPasswordResetEmail(prRequestDTO);
			return ResponseEntity.ok(new Response<String>(true, null, "Password reset link has been resent."));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<String>(false, null, "An error occurred while resending password reset email."));
		}
	}

	@PostMapping("/reset-password")
	public ResponseEntity<Response<String>> resetPassword(@RequestBody PasswordResetDTO passwordResetDTO) {
		try {
			if (passwordResetDTO == null || passwordResetDTO.getToken() == null || passwordResetDTO.getToken().isEmpty()
					|| passwordResetDTO.getNewPassword() == null || passwordResetDTO.getNewPassword().isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<String>(false, null, "Token and new password must not be null or empty."));
			}

			authService.resetPassword(passwordResetDTO);

			return ResponseEntity.ok(new Response<String>(true, null, "Password has been reset successfully."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new Response<String>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<String>(false, null, "An error occurred while resetting the password."));
		}
	}

	@GetMapping("/verify-reset-token")
	public ResponseEntity<Response<String>> verifyResetToken(@RequestParam String token) {
		try {
			if (token == null || token.isEmpty()) {
				return ResponseEntity.badRequest().body(new Response<String>(false, null, "Reset token must not be null or empty."));
			}
			boolean isValid = authService.isPasswordResetTokenValid(token);
			if (!isValid) {
				return ResponseEntity.status(410).body(new Response<String>(false, null, "Invalid or expired reset token."));
			}
			return ResponseEntity.ok(new Response<String>(true, null, "Reset token is valid."));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<String>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<String>(false, null, "An error occurred while verifying the reset token: " + e.getMessage()));
		}
	}


}
