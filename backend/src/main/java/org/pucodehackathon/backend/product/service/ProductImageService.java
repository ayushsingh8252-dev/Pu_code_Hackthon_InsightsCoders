package org.pucodehackathon.backend.product.service;

import org.pucodehackathon.backend.product.dto.ProductImageResponseDto;
import org.pucodehackathon.backend.product.model.ProductImage;

import java.util.List;
import java.util.UUID;

public interface ProductImageService {

    void addImage(UUID vendorUserId, UUID productId, String imageUrl, String publicId);

    List<ProductImage> getProductImages(UUID productId);
    List<ProductImageResponseDto> getImagesByProductId(UUID productId);

    void setPrimaryImage(UUID vendorUserId, UUID imageId);

    void deleteImage(UUID vendorUserId, UUID imageId);
}