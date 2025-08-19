package me.ptakondrej.minieshop.responses;

import lombok.Getter;
import lombok.Setter;
import me.ptakondrej.minieshop.models.UserDTO;

@Getter
@Setter
public class LoginResponse extends Response {

	private UserDTO user;
	private String token;
	private long expiresIn;
	private String refreshToken;

	public LoginResponse(boolean success, UserDTO user, String token, long expiresIn, String refreshToken, String message) {
		super(success, message);
		this.user = user;
		this.token = token;
		this.refreshToken = refreshToken;
		this.expiresIn = expiresIn;
	}
}
