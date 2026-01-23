package org.pucodehackathon.backend.product.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.exception.product_exception.ProductNotFoundException;
import org.pucodehackathon.backend.product.dto.ProductImageResponseDto;
import org.pucodehackathon.backend.product.model.Product;
import org.pucodehackathon.backend.product.model.ProductImage;
import org.pucodehackathon.backend.product.repositories.ProductImageRepository;
import org.pucodehackathon.backend.product.repositories.ProductRepository;
import org.pucodehackathon.backend.product.service.ProductImageService;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final VendorRepository vendorRepository;
    private final ImageUploadService imageUploadService;

    @Override
    public void addImage(UUID userId, UUID productId, String imageUrl, String publicId) {

        Vendor vendor = validateVendor(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found"));

        if (!product.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Product does not belong to vendor");
        }

        boolean hasPrimary = productImageRepository
                .findByProduct_ProductIdAndIsPrimaryTrue(productId)
                .isPresent();

        ProductImage image = ProductImage.builder()
                .product(product)
                .imageUrl(imageUrl)
                .publicId(publicId)
                .isPrimary(!hasPrimary) // first image becomes primary
                .build();

        productImageRepository.save(image);
    }

    @Override
    public List<ProductImage> getProductImages(UUID productId) {
        return productImageRepository.findByProduct_ProductId(productId);
    }

    @Override
    public void setPrimaryImage(UUID userId, UUID imageId) {

        Vendor vendor = validateVendor(userId);

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));

        if (!image.getProduct().getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Unauthorized");
        }

        productImageRepository
                .findByProduct_ProductIdAndIsPrimaryTrue(image.getProduct().getProductId())
                .ifPresent(existing -> {
                    existing.setIsPrimary(false);
                    productImageRepository.save(existing);
                });

        image.setIsPrimary(true);
        productImageRepository.save(image);
    }

    @Override
    public void deleteImage(UUID userId, UUID imageId) {

        Vendor vendor = validateVendor(userId);

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));

        if (!image.getProduct().getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Unauthorized");
        }

        // delete from cloudinary
        imageUploadService.deleteImage(image.getPublicId());

        productImageRepository.delete(image);
    }

    private Vendor validateVendor(UUID userId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new AccessDeniedException("Vendor not found"));

        if (!vendor.getIsActive()) {
            throw new AccessDeniedException("Vendor not active");
        }
        return vendor;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductImageResponseDto> getImagesByProductId(UUID productId) {

        List<ProductImage> images =
                productImageRepository.findByProduct_ProductId(productId);

        return images.stream()
                .map(img -> ProductImageResponseDto.builder()
                        .imageId(img.getImageId())
                        .imageUrl(img.getImageUrl())
                        .isPrimary(img.getIsPrimary())
                        .build())
                .toList();
    }
}
