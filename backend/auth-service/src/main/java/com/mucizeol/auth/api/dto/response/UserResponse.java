package com.mucizeol.auth.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter // getter üret
@Setter // setter üret
@NoArgsConstructor // parametresiz ctor
@AllArgsConstructor // tüm alanları alan ctor
public class UserResponse { // istemciye dönen kullanıcı bilgisi

    private Long userId; // benzersiz kullanıcı kimliği
    private String firstName; // ad
    private String lastName; // soyad
    private String email; // kullanıcı emaili
    private String phoneNumber; // iletişim numarası
    private String roleName; // rol adı
}

