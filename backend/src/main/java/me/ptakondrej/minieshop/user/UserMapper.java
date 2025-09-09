package me.ptakondrej.minieshop.user;

import me.ptakondrej.minieshop.models.UserDTO;

public class UserMapper {

	public static UserDTO convertToDto(User user) {
		return UserDTO.builder()
				.id(user.getId())
				.username(user.getUsername())
				.email(user.getEmail())
				.phone(user.getPhone())
				.firstName(user.getFirstName())
				.lastName(user.getLastName())
				.address(user.getAddress())
				.city(user.getCity())
				.postalCode(user.getPostalCode())
				.country(user.getCountry())
				.state(user.getState())
				.createdAt(user.getCreatedAt())
				.role(user.getRole())
				.enabled(user.isEnabled())
				.build();
	}

	public static User convertToEntity(UserDTO userDTO) {
		return User.builder()
				.id(userDTO.getId())
				.username(userDTO.getUsername())
				.email(userDTO.getEmail())
				.phone(userDTO.getPhone())
				.firstName(userDTO.getFirstName())
				.lastName(userDTO.getLastName())
				.address(userDTO.getAddress())
				.city(userDTO.getCity())
				.postalCode(userDTO.getPostalCode())
				.country(userDTO.getCountry())
				.state(userDTO.getState())
				.role(userDTO.getRole())
				.enabled(userDTO.isEnabled())
				.build();
	}
}
