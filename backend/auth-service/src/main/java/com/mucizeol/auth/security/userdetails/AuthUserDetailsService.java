package com.mucizeol.auth.security.userdetails;

import com.mucizeol.auth.data.entity.UserEntity;
import com.mucizeol.auth.data.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service // Spring Service bileşeni
@RequiredArgsConstructor
public class AuthUserDetailsService implements UserDetailsService { // email'e göre kullanıcı yükler

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı"));
        return AuthUserDetails.from(user);
    }
}

