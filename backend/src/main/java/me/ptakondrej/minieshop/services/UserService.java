package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.user.User;
import me.ptakondrej.minieshop.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

	private final UserRepository userRepository;

	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
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

	public Optional<User> findById(Long userId) {
		if (userId == null || userId <= 0) {
			return Optional.empty();
		}
		return userRepository.findById(userId);
	}
}
