package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.requests.EmailRequest;
import me.ptakondrej.minieshop.requests.PasswordRequest;
import me.ptakondrej.minieshop.requests.UserEditRequest;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Optional<User> findByEmailOrUsername(String emailOrUsername) {
		if  (emailOrUsername == null || emailOrUsername.isBlank() || emailOrUsername.trim().equals("")) {
			return Optional.empty();
		}

		if (emailOrUsername.contains("@")) {
			return userRepository.findByEmail(emailOrUsername);
		} else {
			return userRepository.findByUsername(emailOrUsername);
		}
	}

	public User findById(Long userId) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID: " + userId);
		}
		return userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
	}

	@Transactional
	public void updatePassword(Long userId, PasswordRequest request) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID: " + userId);
		}
		if (request == null) {
			throw new IllegalArgumentException("Request cannot be null");
		}
		String newPassword = request.getNewPassword();
		if (newPassword == null || newPassword.isBlank() || newPassword.trim().isEmpty()) {
			throw new IllegalArgumentException("New password cannot be empty");
		}

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

		if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
			throw new IllegalArgumentException("Old password is incorrect");
		}

		if (passwordEncoder.matches(newPassword, user.getPassword())) {
			throw new IllegalArgumentException("New password must be different from the old password");
		}

		user.setPassword(passwordEncoder.encode(newPassword));
		//user.setTokenVersion(user.getTokenVersion() + 1);
		userRepository.save(user);
	}

	@Transactional
	public void updateEmail(Long userId, EmailRequest request) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID: " + userId);
		}
		if (request == null) {
			throw new IllegalArgumentException("Request cannot be null");
		}
		String newEmail = request.getNewEmail();
		if (newEmail == null || newEmail.isBlank() || newEmail.trim().isEmpty()) {
			throw new IllegalArgumentException("New email cannot be empty");
		}
		if (!newEmail.contains("@") || !newEmail.contains(".")) {
			throw new IllegalArgumentException("Invalid email format");
		}

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

		if (user.getEmail().equalsIgnoreCase(newEmail)) {
			throw new IllegalArgumentException("New email must be different from the old email");
		}

		if (userRepository.findByEmail(newEmail).isPresent()) {
			throw new IllegalArgumentException("Email is already in use");
		}

		user.setEmail(newEmail);
		//user.setTokenVersion(user.getTokenVersion() + 1);
		userRepository.save(user);
	}

	@Transactional
	public User updateName(Long userId, UserEditRequest request) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID: " + userId);
		}
		if (request == null) {
			throw new IllegalArgumentException("Request cannot be null");
		}
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

		if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
			user.setFirstName(request.getFirstName().trim());
		}
		if (request.getLastName() != null && !request.getLastName().isBlank()) {
			user.setLastName(request.getLastName().trim());
		}
		return userRepository.save(user);
	}

	@Transactional
	public void deleteUser(Long userId) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID: " + userId);
		}

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

		user.setDeleted(true);
		user.setDeletedAt(LocalDateTime.now());
		user.setEmail("deleted_" + user.getId() + "_" + System.currentTimeMillis() + "@example.com");
		user.setUsername("deleted_user_" + user.getId() + "_" + System.currentTimeMillis());
		//user.setTokenVersion(user.getTokenVersion() + 1);
		userRepository.save(user);
	}

}
