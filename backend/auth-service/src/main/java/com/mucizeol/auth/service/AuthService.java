package com.mucizeol.auth.service;

import com.mucizeol.auth.api.dto.request.LoginRequest;
import com.mucizeol.auth.api.dto.request.RefreshTokenRequest;
import com.mucizeol.auth.api.dto.request.RegisterRequest;
import com.mucizeol.auth.api.dto.response.AuthTokensResponse;
import com.mucizeol.auth.api.dto.response.UserResponse;

public interface AuthService { // auth iş mantığı sözleşmesi

    UserResponse register(RegisterRequest request); // kullanıcı kaydet

    AuthTokensResponse login(LoginRequest request); // giriş yap

    AuthTokensResponse refresh(RefreshTokenRequest request); // token yenile

    void logout(Long userId); // oturumu kapat

    UserResponse getCurrentUser(Long userId); // mevcut kullanıcıyı getir
}

