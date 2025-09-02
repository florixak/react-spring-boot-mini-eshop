package me.ptakondrej.minieshop.models;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {

	private Long id;
	private String title;
	private String description;
	private String slug;
	private Boolean enabled;
}
