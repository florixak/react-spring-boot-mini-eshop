package me.ptakondrej.minieshop.controllers;

import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.minieshop.models.UserDTO;
import me.ptakondrej.minieshop.requests.PasswordRequest;
import me.ptakondrej.minieshop.requests.UserEditRequest;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.AuthService;
import me.ptakondrej.minieshop.services.RefreshTokenService;
import me.ptakondrej.minieshop.services.UserService;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;
	private final AuthService authService;
	private final RefreshTokenService refreshTokenService;

	public UserController(UserService userService, AuthService authService, RefreshTokenService refreshTokenService) {
		this.userService = userService;
		this.authService = authService;
		this.refreshTokenService = refreshTokenService;
	}

	@PatchMapping("/me/password")
	public ResponseEntity<Response<Void>> updatePassword(@CookieValue(value = "refreshToken") String refreshToken, @RequestAttribute("userId") long userId, @RequestBody PasswordRequest request, HttpServletResponse response) {
		try {
			userService.updatePassword(userId, request);
			refreshTokenService.deleteByOldRefreshToken(refreshToken);
			authService.clearCookies(response);
			return ResponseEntity.ok(new Response<Void>(true, null, "Password updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "Internal server error"));
		}
	}

	@PutMapping("/me")
	public ResponseEntity<Response<UserDTO>> updateUser(@RequestAttribute("userId") long userId, @RequestBody UserEditRequest request) {
		try {
			User updatedUser = userService.updateUser(userId, request);
			UserDTO updatedUserDTO = UserMapper.convertToDto(updatedUser);
			return ResponseEntity.ok(new Response<UserDTO>(true, updatedUserDTO, "User details updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<UserDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<UserDTO>(false, null, "Internal server error"));
		}
	}

	@DeleteMapping("/me")
	public ResponseEntity<Response<Void>> deleteAccount(@RequestAttribute("userId") long userId, HttpServletResponse response) {
		try {
			userService.deleteUser(userId);
			authService.clearCookies(response);
			return ResponseEntity.ok(new Response<Void>(true, null, "Account deleted successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "Internal server error"));
		}
	}

	@GetMapping("/admin")
	public ResponseEntity<Response<List<UserDTO>>> getAllUsers(@RequestParam(required = false) String search) {
		try {
			List<User> users;
			if (search != null && !search.trim().isEmpty() && search.trim().matches("\\d+")) {
				Long id = Long.parseLong(search.trim());
				User user;
				try {
					user = userService.findById(id);
				} catch (IllegalArgumentException e) {
					user = null;
				}
				users = user == null ? List.of() : List.of(user);
			} else {
				users = userService.getAllUsers(search);
			}
			List<UserDTO> userDTOs = users.stream()
					.map(UserMapper::convertToDto)
					.toList();
			return ResponseEntity.ok(new Response<List<UserDTO>>(true, userDTOs, "Users retrieved successfully"));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<List<UserDTO>>(false, null, "Internal server error"));
		}
	}

	@GetMapping("/admin/{userId}")
	public ResponseEntity<Response<UserDTO>> getUserById(@PathVariable Long userId) {
		try {
			User user = userService.findById(userId);
			UserDTO userDTO = UserMapper.convertToDto(user);
			return ResponseEntity.ok(new Response<UserDTO>(true, userDTO, "User retrieved successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<UserDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<UserDTO>(false, null, "Internal server error"));
		}
	}

	@PutMapping("/admin/{userId}")
	public ResponseEntity<Response<UserDTO>> updateUserById(@PathVariable Long userId, @RequestBody UserEditRequest request) {
		try {
			User updatedUser = userService.updateUser(userId, request);
			UserDTO updatedUserDTO = UserMapper.convertToDto(updatedUser);
			return ResponseEntity.ok(new Response<UserDTO>(true, updatedUserDTO, "User updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<UserDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<UserDTO>(false, null, "Internal server error"));
		}
	}

	@DeleteMapping("/admin/{userId}")
	public ResponseEntity<Response<Void>> deleteUserById(@PathVariable Long userId) {
		try {
			userService.deleteUser(userId);
			return ResponseEntity.ok(new Response<Void>(true, null, "User deleted successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "Internal server error"));
		}
	}
}
