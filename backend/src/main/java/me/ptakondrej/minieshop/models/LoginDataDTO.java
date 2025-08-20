package me.ptakondrej.minieshop.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginDataDTO {
	private UserDTO user;
	private String token;
	private long expiresIn;
	private String refreshToken;
}
