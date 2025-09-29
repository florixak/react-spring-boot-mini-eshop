package me.ptakondrej.minieshop.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider, JwtAuthFilter jwtAuthFilter) throws Exception {
		http.cors(Customizer.withDefaults())
				.csrf(csrf -> csrf.disable())
				.exceptionHandling(exception -> exception
						.authenticationEntryPoint((request, response, authException) -> {
							response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
							response.setContentType("application/json");
							response.getWriter().write("{\"success\":false,\"data\":null,\"message\":\"Unauthorized\"}");
						})
				)
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers("/api/products/admin", "/api/products/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/orders/admin", "/api/orders/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/categories/admin", "/api/categories/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/users/admin", "/api/users/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/admin/dashboard/**").hasRole("ADMIN")
						.requestMatchers("/api/products").permitAll()
						.requestMatchers("/api/checkout/create-checkout-session").permitAll()
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/api/categories/**").permitAll()
						.requestMatchers("/api/webhooks/**").permitAll()
						.requestMatchers("/success", "/cancel").permitAll()
						.requestMatchers("/actuator/health").permitAll()
						.requestMatchers("/actuator/info").permitAll()
						.requestMatchers("/api/supabase-activity-scheduler").permitAll()
						.anyRequest().authenticated()
				)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authenticationProvider(authenticationProvider)
				.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOrigins(List.of(
				"http://localhost:8080",
				"http://localhost:5173",
				"https://react-spring-boot-mini-eshop.vercel.app/",
				"https://react-spring-boot-mini-eshop-git-main-florixaks-projects.vercel.app/",
				"https://react-spring-boot-mini-eshop-m75dwuaxt-florixaks-projects.vercel.app/"
		));
		config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Stripe-Signature", "X-SCHEDULER-TOKEN"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

}
