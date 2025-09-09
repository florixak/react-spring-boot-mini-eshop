package me.ptakondrej.minieshop.models;

import lombok.*;
import me.ptakondrej.minieshop.user.Role;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

	private Long id;
	private String username;
	private String email;
	private String phone;
	private String firstName;
	private String lastName;
	private String address;
	private String city;
	private String postalCode;
	private String country;
	private String state;
	private LocalDateTime createdAt;
	private Role role;
	private boolean enabled;
}
