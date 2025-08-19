package me.ptakondrej.minieshop.responses;

import lombok.Getter;
import lombok.Setter;
import me.ptakondrej.minieshop.models.UserDTO;

@Getter
@Setter
public class RegisterResponse extends Response {

	private UserDTO user;

	public RegisterResponse(boolean success, UserDTO user, String message) {
		super(success, message);
		this.user = user;
	}
}
