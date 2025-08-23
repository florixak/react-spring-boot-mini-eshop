package me.ptakondrej.minieshop.services;

import me.ptakondrej.minieshop.auth.RefreshToken;
import me.ptakondrej.minieshop.auth.RefreshTokenRepository;
import me.ptakondrej.minieshop.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

	private final RefreshTokenRepository refreshTokenRepository;

	public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
		this.refreshTokenRepository = refreshTokenRepository;
	}

	@Transactional
	public RefreshToken createRefreshToken(User user) {
		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setToken(UUID.randomUUID().toString());
		refreshToken.setUser(user);
		refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
		return refreshTokenRepository.save(refreshToken);
	}

	@Transactional
	public RefreshToken verifyExpiration(RefreshToken refreshToken) {
		if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
			refreshTokenRepository.delete(refreshToken);
			throw new RuntimeException("Refresh token expired.");
		}
		return refreshToken;
	}

	@Transactional
	public void deleteByOldRefreshToken(String oldRefreshToken) {
		refreshTokenRepository.deleteByToken(oldRefreshToken);
	}

	@Transactional
	public void deleteAllByUserId(Long userId) {
		refreshTokenRepository.findAll().stream()
				.filter(token -> token.getUser().getId().equals(userId))
				.forEach(refreshTokenRepository::delete);
	}

	@Transactional(readOnly = true)
	public Optional<RefreshToken> findByToken(String token) {
		return refreshTokenRepository.findByToken(token);
	}
}
