package me.ptakondrej.minieshop.models;

import lombok.*;
import me.ptakondrej.minieshop.user.Role;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

	private Long id;
	private String username;
	private String email;
	private String firstName;
	private String lastName;
	private Role role;
	private boolean enabled;
}
