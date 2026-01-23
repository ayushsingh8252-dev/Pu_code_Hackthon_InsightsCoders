package org.pucodehackathon.backend.product.service.impl;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public Map uploadImage(MultipartFile file, String folder) {
        try {
            return cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of("folder", folder)
            );
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, Map.of());
        } catch (Exception e) {
            throw new RuntimeException("Image delete failed", e);
        }
    }
}
