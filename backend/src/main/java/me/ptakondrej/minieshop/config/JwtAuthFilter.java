package me.ptakondrej.minieshop.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import me.ptakondrej.minieshop.services.JwtService;
import me.ptakondrej.minieshop.services.UserService;
import me.ptakondrej.minieshop.user.User;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final UserService userService;

	public JwtAuthFilter(JwtService jwtService, UserService userService) {
		this.jwtService = jwtService;
		this.userService = userService;
	}

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request,
									@NonNull HttpServletResponse response,
									@NonNull FilterChain filterChain) throws ServletException, IOException {
		String requestPath = request.getRequestURI();

		if (requestPath.startsWith("/api/auth/")) {
			filterChain.doFilter(request, response);
			return;
		}

		final String authHeader = request.getHeader("Authorization");

		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			final String token = authHeader.substring(7);
			final String username = jwtService.extractUsername(token);
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();

			if (username == null || auth != null) {
				filterChain.doFilter(request, response);
				return;
			}

			User user = userService.findByEmailOrUsername(username)
					.orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));

			if (user.isDeleted()) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User account is deleted");
				return;
			}

			if (!jwtService.isTokenValid(token, user)) {
				response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
				return;
			}

			Long userId = jwtService.extractClaim(token, claims -> claims.get("id", Long.class));
			request.setAttribute("userId", userId);

			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
			authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(authToken);

			filterChain.doFilter(request, response);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.setContentType("application/json");
			response.getWriter().write("{\"success\":false,\"data\":null,\"message\":\"Invalid or expired JWT token\"}");
			response.getWriter().flush();
			return;
		}
	}
}
