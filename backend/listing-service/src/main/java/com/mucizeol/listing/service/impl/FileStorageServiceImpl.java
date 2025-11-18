package com.mucizeol.listing.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.mucizeol.listing.exception.BusinessException;
import com.mucizeol.listing.service.FileStorageService;
import java.io.IOException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final AmazonS3 amazonS3;

    @Value("${s3.bucket-name}")
    private String bucketName;

    @Value("${s3.cdn-url}")
    private String cdnUrl;

    @Override
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("FILE.EMPTY", "Dosya boş olamaz");
        }

        // Dosya boyut kontrolü (5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BusinessException("FILE.TOO_LARGE", "Dosya boyutu 5MB'dan büyük olamaz");
        }

        // Dosya tipi kontrolü
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("FILE.INVALID_TYPE", "Sadece resim dosyaları yüklenebilir");
        }

        try {
            // Benzersiz dosya adı oluştur
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                    : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;

            // S3 metadata
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(contentType);
            metadata.setContentLength(file.getSize());

            // S3'e yükle
            PutObjectRequest putRequest = new PutObjectRequest(
                    bucketName,
                    filename,
                    file.getInputStream(),
                    metadata
            ).withCannedAcl(CannedAccessControlList.PublicRead); // Herkese açık

            amazonS3.putObject(putRequest);

            // CDN URL'i döndür
            String imageUrl = cdnUrl + "/" + filename;
            
            log.info("Dosya S3'e yüklendi: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Dosya S3'e yüklenemedi", e);
            throw new BusinessException("FILE.STORAGE_ERROR", "Dosya yüklenemedi");
        }
    }
}

