package me.ptakondrej.minieshop.responses;

import me.ptakondrej.minieshop.models.LoginDataDTO;

public class LoginResponse extends Response<LoginDataDTO> {

	public LoginResponse(boolean success, LoginDataDTO data, String message) {
		super(success, data, message);
	}
}
