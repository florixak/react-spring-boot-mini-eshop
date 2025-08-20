package me.ptakondrej.minieshop.user;

import me.ptakondrej.minieshop.models.UserDTO;

public class UserMapper {

	public static UserDTO convertToDto(User user) {
		return UserDTO.builder()
				.id(user.getId())
				.username(user.getUsername())
				.email(user.getEmail())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.role(user.getRole())
				.enabled(user.isEnabled())
				.build();
	}

	public static User convertToEntity(UserDTO userDTO) {
		return User.builder()
				.id(userDTO.getId())
				.username(userDTO.getUsername())
				.email(userDTO.getEmail())
				.firstName(userDTO.getFirstName())
				.lastName(userDTO.getLastName())
				.role(userDTO.getRole())
				.enabled(userDTO.isEnabled())
				.build();
	}
}
