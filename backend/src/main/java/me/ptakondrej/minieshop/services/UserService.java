package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.requests.AdminUserEditRequest;
import me.ptakondrej.minieshop.requests.PasswordRequest;
import me.ptakondrej.minieshop.requests.UserEditRequest;
import me.ptakondrej.minieshop.user.Role;
import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserRepository;
import me.ptakondrej.minieshop.user.UserSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional(readOnly = true)
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

	@Transactional(readOnly = true)
	public User findById(Long userId) {
		if (userId == null || userId <= 0) {
			throw new IllegalArgumentException("Invalid user ID: " + userId);
		}
		return userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
	}

	@Transactional(readOnly = true)
	public List<User> getAllUsers(String search) {
		return userRepository.findAll(UserSpecification.filter(search), Sort.by("id").descending());
	}

	public int countUsers() {
		return (int) userRepository.count();
	}

	public int countNewUsersInLastDays(int days) {
		if (days <= 0) {
			throw new IllegalArgumentException("Days must be greater than 0");
		}
		LocalDateTime since = LocalDateTime.now().minusDays(days);
		return (int) userRepository.countByCreatedAtAfter(since);
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
	public User updateUser(Long userId, UserEditRequest request) {
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
		if (request.getEmail() != null && !request.getEmail().isBlank()) {
			if (!request.getEmail().contains("@") || !request.getEmail().contains(".")) {
				throw new IllegalArgumentException("Invalid email format");
			}
			String trimmedEmail = request.getEmail().trim();
			if (userRepository.findByEmail(trimmedEmail).isPresent() && !user.getEmail().equalsIgnoreCase(trimmedEmail)) {
				throw new IllegalArgumentException("Email is already in use");
			}
			user.setEmail(trimmedEmail);
		}

		if (request.getAddress() != null && !request.getAddress().isBlank()) {
			user.setAddress(request.getAddress());
		}
		if (request.getCity() != null && !request.getCity().isBlank()) {
			user.setCity(request.getCity());
		}
		if (request.getPostalCode() != null && !request.getPostalCode().isBlank()) {
			user.setPostalCode(request.getPostalCode().trim());
		}
		if (request.getCountry() != null && !request.getCountry().isBlank()) {
			user.setCountry(request.getCountry());
		}
		if (request.getState() != null && !request.getState().isBlank()) {
			user.setState(request.getState());
		}
		if (request.getPhone() != null && !request.getPhone().isBlank()) {
			if (!request.getPhone().matches("^[+]?\\d{7,15}$")) {
				throw new IllegalArgumentException("Invalid phone number format");
			}
			user.setPhone(request.getPhone().trim());
		}
		return userRepository.save(user);
	}

	@Transactional
	public User updateUser(Long userId, AdminUserEditRequest request) {
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
		if (request.getEmail() != null && !request.getEmail().isBlank()) {
			if (!request.getEmail().contains("@") || !request.getEmail().contains(".")) {
				throw new IllegalArgumentException("Invalid email format");
			}
			String trimmedEmail = request.getEmail().trim();
			if (userRepository.findByEmail(trimmedEmail).isPresent() && !user.getEmail().equalsIgnoreCase(trimmedEmail)) {
				throw new IllegalArgumentException("Email is already in use");
			}
			user.setEmail(trimmedEmail);
		}

		if (request.getRole() != null) {
			user.setRole(Role.fromString(request.getRole()));
		}

		if (request.getVerified() != null) {
			user.setVerified(request.getVerified());
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

	public void pingDatabase() {
		userRepository.count();
	}

}
