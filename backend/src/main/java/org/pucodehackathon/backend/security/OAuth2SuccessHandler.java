package org.pucodehackathon.backend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.model.Provider;
import org.pucodehackathon.backend.auth.model.RefreshToken;
import org.pucodehackathon.backend.auth.model.User;
import org.pucodehackathon.backend.auth.repositories.RefreshTokenRepository;
import org.pucodehackathon.backend.auth.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final CookieService cookieService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${app.auth.frontend.success-redirect}")
    private String frontEndSuccessUrl;

    @Override
    @Transactional
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String registrationId = "unknown";
        if (authentication instanceof OAuth2AuthenticationToken token) {
            registrationId = token.getAuthorizedClientRegistrationId();
        }

        logger.info("OAuth2 login success via provider: {}", registrationId);

        User user;

        switch (registrationId) {

            case "google" -> {
                assert oAuth2User != null;
                String googleId = String.valueOf(oAuth2User.getAttributes().get("sub"));
                String email = String.valueOf(oAuth2User.getAttributes().get("email"));
                String picture = String.valueOf(oAuth2User.getAttributes().get("picture"));

                String firstName = (String) oAuth2User.getAttributes().get("given_name");
                String lastName = (String) oAuth2User.getAttributes().get("family_name");

                // Fallback if given/family name not present
                if (firstName == null || lastName == null) {
                    String fullName = String.valueOf(oAuth2User.getAttributes().get("name"));
                    String[] parts = fullName.split(" ", 2);
                    firstName = parts[0];
                    lastName = parts.length > 1 ? parts[1] : "";
                }

                User newUser = User.builder()
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .image(picture)
                        .enabled(true)
                        .provider(Provider.GOOGLE)
                        .providerId(googleId)
                        .build();

                user = userRepository.findByEmail(email)
                        .orElseGet(() -> userRepository.save(newUser));
            }

            case "github" -> {
                assert oAuth2User != null;
                String githubId = String.valueOf(oAuth2User.getAttributes().get("id"));
                String login = String.valueOf(oAuth2User.getAttributes().get("login"));
                String image = String.valueOf(oAuth2User.getAttributes().get("avatar_url"));

                String email = (String) oAuth2User.getAttributes().get("email");
                if (email == null) {
                    email = login + "@github.com";
                }

                String fullName = (String) oAuth2User.getAttributes().get("name");
                if (fullName == null || fullName.isBlank()) {
                    fullName = login;
                }

                String[] parts = fullName.split(" ", 2);
                String firstName = parts[0];
                String lastName = parts.length > 1 ? parts[1] : "";

                User newUser = User.builder()
                        .email(email)
                        .firstName(firstName)
                        .lastName(lastName)
                        .image(image)
                        .enabled(true)
                        .provider(Provider.GITHUB)
                        .providerId(githubId)
                        .build();

                user = userRepository.findByEmail(email)
                        .orElseGet(() -> userRepository.save(newUser));
            }

            default -> throw new RuntimeException("Unsupported OAuth2 provider: " + registrationId);
        }

        // Create refresh token
        String jti = UUID.randomUUID().toString();

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .jti(jti)
                .user(user)
                .revoked(false)
                .createdAt(LocalDateTime.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getRefreshTtlSeconds()))
                .build();

        refreshTokenRepository.save(refreshTokenEntity);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user, jti);

        cookieService.attachRefreshCookie(
                response,
                refreshToken,
                (int) jwtService.getRefreshTtlSeconds()
        );

        response.sendRedirect(frontEndSuccessUrl);
    }
}
