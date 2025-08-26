package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.models.UserDTO;
import me.ptakondrej.minieshop.requests.EmailRequest;
import me.ptakondrej.minieshop.requests.PasswordRequest;
import me.ptakondrej.minieshop.requests.UserEditRequest;
import me.ptakondrej.minieshop.responses.Response;
import me.ptakondrej.minieshop.services.UserService;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping("/me")
	public ResponseEntity<Response<UserDTO>> getCurrentUser(@RequestAttribute("userId") long userId) {
		try {
			User user = userService.findById(userId);
			UserDTO userDTO = UserMapper.convertToDto(user);
			return ResponseEntity.ok(new Response<UserDTO>(true, userDTO, "User fetched successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<UserDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<UserDTO>(false, null, "Internal server error"));
		}
	}

	@PatchMapping("/me/password")
	public ResponseEntity<Response<Void>> updatePassword(@RequestAttribute("userId") long userId, @RequestBody PasswordRequest request) {
		try {
			userService.updatePassword(userId, request);
			return ResponseEntity.ok(new Response<Void>(true, null, "Password updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "Internal server error"));
		}
	}

	@PatchMapping("/me/email")
	public ResponseEntity<Response<Void>> updateEmail(@RequestAttribute("userId") long userId, @RequestBody EmailRequest request) {
		try {
			userService.updateEmail(userId, request);
			return ResponseEntity.ok(new Response<Void>(true, null, "Email updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "Internal server error"));
		}
	}

	@PatchMapping("/me")
	public ResponseEntity<Response<UserDTO>> updateName(@RequestAttribute("userId") long userId, @RequestBody UserEditRequest request) {
		try {
			User updatedUser = userService.updateName(userId, request);
			UserDTO updatedUserDTO = UserMapper.convertToDto(updatedUser);
			return ResponseEntity.ok(new Response<UserDTO>(true, updatedUserDTO, "User details updated successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<UserDTO>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<UserDTO>(false, null, "Internal server error"));
		}
	}

	@DeleteMapping("/me")
	public ResponseEntity<Response<Void>> deleteAccount(@RequestAttribute("userId") long userId) {
		try {
			userService.deleteUser(userId);
			return ResponseEntity.ok(new Response<Void>(true, null, "Account deleted successfully"));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(new Response<Void>(false, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(new Response<Void>(false, null, "Internal server error"));
		}
	}
}
