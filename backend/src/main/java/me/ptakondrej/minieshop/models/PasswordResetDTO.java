package me.ptakondrej.minieshop.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetDTO {
	private String token;
	private String newPassword;
}
