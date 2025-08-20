package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.product.Product;
import me.ptakondrej.minieshop.product.ProductRepository;
import me.ptakondrej.minieshop.utils.SlugUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

	private final ProductRepository productRepository;

	public ProductService(ProductRepository productRepository) {
		this.productRepository = productRepository;
	}

	public Page<Product> getAllProducts(Pageable pageable) {
		return productRepository.findAll(pageable);
	}

	public Product getProductById(Long id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
	}

	public Product getProductBySlug(String slug) {
		return productRepository.findBySlug(slug)
				.orElseThrow(() -> new IllegalArgumentException("Product not found with slug: " + slug));
	}

	public Product createProduct(Product product) throws IllegalArgumentException {
		product.setSlug(SlugUtils.generateSlug(product.getTitle()));
		return productRepository.save(product);
	}

	public Product updateProduct(Long id, Product product) throws IllegalArgumentException {
		Product existingProduct = getProductById(id);
		existingProduct.setTitle(product.getTitle());
		existingProduct.setDescription(product.getDescription());
		existingProduct.setPrice(product.getPrice());
		existingProduct.setImageUrl(product.getImageUrl());
		existingProduct.setCategory(product.getCategory());
		existingProduct.setEnabled(product.getEnabled());
		return productRepository.save(existingProduct);
	}

	public boolean existsProductById(Long id) {
		return productRepository.existsById(id);
	}

	public boolean existsProductBySlug(String title) {
		String slug = SlugUtils.generateSlug(title);
		return productRepository.findBySlug(slug).isPresent();
	}

	public boolean deleteProduct(Long id) {
		if (!productRepository.existsById(id)) {
			throw new IllegalArgumentException("Product not found with id: " + id);
		}
		productRepository.deleteById(id);
		return true;
	}

}
