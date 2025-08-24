package me.ptakondrej.minieshop.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

	@Value("${stripe.secret-key}")
	private String secretKey;

	@PostConstruct
	public void init() {
		Stripe.apiKey = secretKey;
	}
}
