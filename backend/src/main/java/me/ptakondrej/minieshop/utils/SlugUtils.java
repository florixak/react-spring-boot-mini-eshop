package me.ptakondrej.minieshop.utils;

import java.text.Normalizer;

public class SlugUtils {

	public static String generateSlug(String input) {
		String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
				.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
		return normalized
				.toLowerCase()
				.replaceAll("[^a-z0-9\\s-]", "")
				.replaceAll("\\s+", "-")
				.replaceAll("-{2,}", "-")
				.replaceAll("^-|-$", "");
	}
}
