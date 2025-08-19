package me.ptakondrej.minieshop.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Response {

	private boolean success;
	private String message;
}
