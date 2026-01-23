package org.pucodehackathon.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final JwtService jwtService;
//    private final UserRepository userRepository;
//
//    @Override
//    protected void doFilterInternal(
//            HttpServletRequest request,
//            HttpServletResponse response,
//            FilterChain filterChain
//    ) throws ServletException, IOException {
//
//        String header = request.getHeader("Authorization");
//        log.info("Authorization Header : {}", header);
//
//        if (header == null || !header.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        String token = header.substring(7);
//
//        try {
//            if (!jwtService.isAccessToken(token)) {
//                filterChain.doFilter(request, response);
//                return;
//            }
//
//            Claims claims = jwtService.parse(token).getPayload();
//            UUID userId = UserHelper.parseUUID(claims.getSubject());
//
//            if (SecurityContextHolder.getContext().getAuthentication() != null) {
//                filterChain.doFilter(request, response);
//                return;
//            }
//
//            var userOptional = userRepository.findById(userId);
//
//            if (userOptional.isEmpty()) {
//                log.error("User not found for ID: {}", userId);
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
//                return;
//            }
//
//            var user = userOptional.get();
//
//            if (!user.isEnabled()) {
//                log.error("User {} is not enabled", user.getEmail());
//                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User account is not enabled");
//                return;
//            }
//
//            List<SimpleGrantedAuthority> authorities =
//                    user.getRoles().stream()
//                            .map(role -> new SimpleGrantedAuthority(role.getRoleName().name()))
//                            .toList();
//
//            log.info("User {} authenticated with authorities: {}", user.getEmail(), authorities);
//
//            UsernamePasswordAuthenticationToken auth =
//                    new UsernamePasswordAuthenticationToken(
//                            user.getEmail(),
//                            null,
//                            authorities
//                    );
//
//            auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//            SecurityContextHolder.getContext().setAuthentication(auth);
//
//        } catch (ExpiredJwtException e) {
//            log.error("JWT Expired: {}", e.getMessage());
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
//            return;
//        } catch (Exception e) {
//            log.error("JWT Authentication failed: {}", e.getMessage());
//            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
//            return;
//        }
//
//        filterChain.doFilter(request, response);
//    }
//
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        return false;
//    }
//}

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailService customUserDetailService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        log.info("Authorization Header : {}", header);

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            if (!jwtService.isAccessToken(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            Claims claims = jwtService.parse(token).getPayload();
            String email = claims.get("email", String.class);

            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            // ✅ Load UserPrincipal
            UserDetails userDetails =
                    customUserDetailService.loadUserByUsername(email);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,                   // ✅ UserPrincipal
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            log.info("User {} authenticated with authorities: {}",
                    userDetails.getUsername(),
                    userDetails.getAuthorities());

        } catch (ExpiredJwtException e) {
            log.error("JWT Expired: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
            return;
        } catch (Exception e) {
            log.error("JWT Authentication failed", e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
