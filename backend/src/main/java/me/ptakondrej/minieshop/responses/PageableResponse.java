package me.ptakondrej.minieshop.responses;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PageableResponse<T> {

	private List<T> items;
	private Integer page;
	private Integer size;
	private Long totalItems;
	private Integer totalPages;


}
