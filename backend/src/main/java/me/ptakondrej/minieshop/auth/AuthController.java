package me.ptakondrej.minieshop.auth;

import me.ptakondrej.minieshop.models.LoginUserDTO;
import me.ptakondrej.minieshop.models.RegisterUserDTO;
import me.ptakondrej.minieshop.models.UserDTO;
import me.ptakondrej.minieshop.requests.RefreshTokenRequest;
import me.ptakondrej.minieshop.responses.LoginResponse;
import me.ptakondrej.minieshop.responses.RegisterResponse;
import me.ptakondrej.minieshop.services.AuthService;
import me.ptakondrej.minieshop.services.JwtService;
import me.ptakondrej.minieshop.services.RefreshTokenService;
import me.ptakondrej.minieshop.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService authService;
	private final JwtService jwtService;
	private final RefreshTokenService refreshTokenService;

	public AuthController(AuthService authService, JwtService jwtService, RefreshTokenService refreshTokenService) {
		this.authService = authService;
		this.jwtService = jwtService;
		this.refreshTokenService = refreshTokenService;
	}

	@PostMapping("/signup")
	public ResponseEntity<RegisterResponse> signUp(@RequestBody RegisterUserDTO registerUserDTO) {
		try {
			User user = authService.signUp(registerUserDTO);
			UserDTO userDTO = new UserDTO(
					user.getId(),
					user.getUsername(),
					user.getEmail(),
					true
			);
			return ResponseEntity.ok(new RegisterResponse(true, userDTO, "Registration successful. Please verify your email."));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new RegisterResponse(false, null, e.getMessage()));
		}
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDTO loginUserDTO) {
		try {

			User authenticatedUser = authService.authenticate(loginUserDTO);
			HashMap<String, Object> userDetails = authService.createUserDetails(authenticatedUser);
			String token = jwtService.generateToken(userDetails, authenticatedUser);
			UserDTO userDTO = new UserDTO(
					authenticatedUser.getId(),
					authenticatedUser.getUsername(),
					authenticatedUser.getEmail(),
					authenticatedUser.isEnabled()
			);
			RefreshToken refreshToken = refreshTokenService.createRefreshToken(authenticatedUser);

			return ResponseEntity.ok(new LoginResponse(
					true,
					userDTO,
					token,
					jwtService.getExpirationTime(),
					refreshToken.getToken(),
					"Login successful"
			));

		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new LoginResponse(false, null, null, -1, null,  e.getMessage()));
		}
	}

	@PostMapping("/refresh-token")
	public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
		try {
			RefreshToken refreshToken = refreshTokenService
					.findByToken(refreshTokenRequest.getRefreshToken())
					.map(refreshTokenService::verifyExpiration)
					.orElseThrow(() -> new RuntimeException("Invalid refresh token."));

			User user = refreshToken.getUser();
			HashMap<String, Object> userDetails = authService.createUserDetails(user);
			String newAccesToken = jwtService.generateToken(userDetails, user);
			UserDTO userDTO = new UserDTO(
					user.getId(),
					user.getUsername(),
					user.getEmail(),
					user.isEnabled()
			);
			return ResponseEntity.ok(new LoginResponse(
					true,
					userDTO,
					newAccesToken,
					jwtService.getExpirationTime(),
					refreshToken.getToken(),
					"Token refreshed successfully"
			));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(new LoginResponse(false, null, null, -1, null, e.getMessage()));
		}
	}

}
