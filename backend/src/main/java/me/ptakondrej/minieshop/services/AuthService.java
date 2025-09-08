package me.ptakondrej.minieshop.services;

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

	public AuthService(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder,
			AuthenticationManager authenticationManager, WishlistService wishlistService) {
		this.userRepository = userRepository;
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.wishlistService = wishlistService;
	}

	public User signUp(RegisterUserDTO registerUserDTO) {
		User user = User.builder()
				.username(registerUserDTO.getUsername())
				.password(passwordEncoder.encode(registerUserDTO.getPassword()))
				.email(registerUserDTO.getEmail())
				.firstName(null)
				.lastName(null)
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
















}
