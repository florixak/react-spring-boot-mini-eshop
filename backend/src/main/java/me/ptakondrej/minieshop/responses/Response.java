package me.ptakondrej.minieshop.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Response<T> {

	private boolean success;
	private T data;
	private String message;
}
