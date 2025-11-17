package com.mucizeol.auth.security.filter;

import com.mucizeol.auth.security.jwt.JwtPayload;
import com.mucizeol.auth.security.jwt.JwtTokenService;
import com.mucizeol.auth.security.userdetails.AuthUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component // Spring'in yönettiği filter
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter { // her istekte JWT kontrolü

    private final JwtTokenService jwtTokenService;
    private final AuthUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = extractToken(request);
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                JwtPayload payload = jwtTokenService.parseToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(payload.email());
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication); // kullanıcıyı bağla
            } catch (Exception ex) {
                SecurityContextHolder.clearContext(); // token geçersizse context temizle
            }
        }
        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) { // Authorization header'dan token al
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}

