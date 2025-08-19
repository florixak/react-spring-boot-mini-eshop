package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.auth.RefreshToken;
import me.ptakondrej.minieshop.auth.RefreshTokenRepository;
import me.ptakondrej.minieshop.user.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

	private final RefreshTokenRepository refreshTokenRepository;

	public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
		this.refreshTokenRepository = refreshTokenRepository;
	}

	public RefreshToken createRefreshToken(User user) {
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setToken(UUID.randomUUID().toString());
		refreshToken.setUser(user);
		refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
		return refreshTokenRepository.save(refreshToken);
	}

	public RefreshToken verifyExpiration(RefreshToken refreshToken) {
		if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			refreshTokenRepository.delete(refreshToken);
			throw new RuntimeException("Refresh token expired.");
		}
		return refreshToken;
	}

	public Optional<RefreshToken> findByToken(String token) {
		return refreshTokenRepository.findByToken(token);
	}
}
