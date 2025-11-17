package com.mucizeol.auth.security.userdetails;

import com.mucizeol.auth.data.entity.UserEntity;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Getter // alanlara erişim için getter
public class AuthUserDetails implements UserDetails { // SecurityContext içinde taşınacak kullanıcı

    private final Long id; // kullanıcı kimliği
    private final String email; // kullanıcı emaili
    private final String password; // hash'lenmiş parola
    private final List<GrantedAuthority> authorities; // roller

    private AuthUserDetails(Long id, String email, String password, String roleName) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.authorities = List.of(new SimpleGrantedAuthority(roleName));
    }

    public static AuthUserDetails from(UserEntity user) { // entity'den UserDetails oluştur
        return new AuthUserDetails(user.getId(), user.getEmail(), user.getPasswordHash(), user.getRole().getName());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

