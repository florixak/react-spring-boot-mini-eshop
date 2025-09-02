package me.ptakondrej.minieshop.category;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "categories")
@Builder
public class Category {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String title;
	@Column(nullable = false, unique = true)
	private String slug;
	@Column(nullable = false, length = 500)
	private String description;
	@Column(nullable = false, columnDefinition = "boolean default true")
	private Boolean enabled = true;
	@CreationTimestamp
	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt;
	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
	@Column(nullable = false, columnDefinition = "boolean default false")
	private Boolean deleted = true;
	@Column(name = "deleted_at")
	private LocalDateTime deletedAt;
}
