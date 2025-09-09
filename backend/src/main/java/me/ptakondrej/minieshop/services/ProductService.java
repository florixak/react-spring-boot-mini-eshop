package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.category.Category;
import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.product.ProductRepository;
import me.ptakondrej.minieshop.product.ProductSpecification;
import me.ptakondrej.minieshop.requests.ProductRequest;
import me.ptakondrej.minieshop.utils.SlugUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class ProductService {

	private final ProductRepository productRepository;
	private final CategoryService categoryService;

	public ProductService(ProductRepository productRepository, CategoryService categoryService) {
		this.productRepository = productRepository;
		this.categoryService = categoryService;
	}

	public Page<Product> getAllProducts(Pageable pageable) {
		return productRepository.findAll(pageable);
	}

	public Page<Product> filterProducts(
			String categorySlug,
			Double minPrice,
			Double maxPrice,
			String search,
			boolean inStock,
			Pageable pageable
	) {
		Category category = categorySlug != null ? categoryService.getCategoryBySlug(categorySlug) : null;
		Long categoryId = category != null ? category.getId() : null;
		Specification<Product> spec = ProductSpecification.filter(categoryId, minPrice, maxPrice, search, inStock);
		return productRepository.findAll(spec, pageable);
	}

	public Product getProductById(Long id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
	}

	public Product getProductBySlug(String slug) {
		return productRepository.findBySlug(slug)
				.orElseThrow(() -> new IllegalArgumentException("Product not found with slug: " + slug));
	}

	@Transactional
	public Product createProduct(ProductRequest request) throws IllegalArgumentException {
		if (!validateProductRequest(request)) {
			throw new IllegalArgumentException("Invalid product data");
		}

		if (existsProductBySlug(request.getTitle())) {
			throw new IllegalArgumentException("Product with the same title already exists");
		}

		Category category = categoryService.getCategoryById(request.getCategoryId());
		if (category == null) {
			throw new IllegalArgumentException("Category not found with id: " + request.getCategoryId());
		}

		Product product = Product.builder()
				.title(request.getTitle())
				.description(request.getDescription())
				.price(BigDecimal.valueOf(request.getPrice()))
				.category(category)
				.imageUrl(request.getImageUrl())
				.stockQuantity(request.getStockQuantity())
				.enabled(true)
				.deleted(false)
				.build();
		product.setSlug(SlugUtils.generateSlug(product.getTitle()));
		return productRepository.save(product);
	}

	@Transactional
	public Product updateProduct(Long id, ProductRequest request) throws IllegalArgumentException {
		if (!validateProductRequest(request)) {
			throw new IllegalArgumentException("Invalid product data");
		}

		if (!existsProductById(id)) {
			throw new IllegalArgumentException("Product not found with id: " + id);
		}

		Category category = categoryService.getCategoryById(request.getCategoryId());
		if (category == null) {
			throw new IllegalArgumentException("Category not found with id: " + request.getCategoryId());
		}

		Product product = getProductById(id);

		product.setTitle(request.getTitle());
		product.setDescription(request.getDescription());
		product.setPrice(BigDecimal.valueOf(request.getPrice()));
		product.setCategory(category);
		product.setImageUrl(request.getImageUrl());
		product.setStockQuantity(request.getStockQuantity());
		product.setSlug(SlugUtils.generateSlug(product.getTitle()));
		product.setEnabled(request.getEnabled());
		return productRepository.save(product);
	}

	@Transactional
	public void reduceStock(Long productId, int quantity) throws IllegalArgumentException {
		Product product = getProductById(productId);
		if (product == null) {
			throw new IllegalArgumentException("Product not found with id: " + productId);
		}
		if (quantity <= 0) {
			throw new IllegalArgumentException("Quantity must be greater than zero");
		}
		if (product.getStockQuantity() < quantity) {
			throw new IllegalArgumentException("Insufficient stock for product id: " + productId);
		}
		product.setStockQuantity(product.getStockQuantity() - quantity);
		productRepository.save(product);
	}

	public boolean existsProductById(Long id) {
		return productRepository.existsById(id);
	}

	public boolean existsProductBySlug(String title) {
		String slug = SlugUtils.generateSlug(title);
		return productRepository.findBySlug(slug).isPresent();
	}

	@Transactional
	public Product deleteProduct(Long id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

		product.setDeleted(true);
		product.setDeletedAt(LocalDateTime.now());
		product.setEnabled(false);
		return productRepository.save(product);
	}

	private boolean validateProductRequest(ProductRequest request) {
		return request != null
				&& request.getTitle() != null && !request.getTitle().trim().isEmpty()
				&& request.getPrice() > 0
				&& request.getCategoryId() > 0;
	}

}
