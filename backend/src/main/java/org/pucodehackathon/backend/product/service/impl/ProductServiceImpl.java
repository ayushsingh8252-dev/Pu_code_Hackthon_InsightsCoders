package org.pucodehackathon.backend.product.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.exception.product_exception.CategoryNotFoundException;
import org.pucodehackathon.backend.exception.product_exception.ProductNotFoundException;
import org.pucodehackathon.backend.product.dto.CreateProductRequestDto;
import org.pucodehackathon.backend.product.dto.ProductListItemDto;
import org.pucodehackathon.backend.product.dto.ProductResponseDto;
import org.pucodehackathon.backend.product.dto.UpdateProductRequestDto;
import org.pucodehackathon.backend.product.model.Category;
import org.pucodehackathon.backend.product.model.Product;
import org.pucodehackathon.backend.product.repositories.CategoryRepository;
import org.pucodehackathon.backend.product.repositories.ProductRepository;
import org.pucodehackathon.backend.product.service.ProductService;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponseDto createProduct(UUID userId, CreateProductRequestDto request) {
        Vendor vendor = validateVendorAccess(userId);

        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(
                () -> new CategoryNotFoundException("Category is Not Found by This id " + request.getCategoryId())
        );

        if (!category.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Category does not belong to vendor");
        }

        Product product = Product.builder()
                .vendor(vendor)
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .build();

        productRepository.save(product);

        return ProductResponseDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .isAvailable(product.getIsAvailable())
                .build();
    }

    @Override
    public Product getProductById(UUID productId) {
        return productRepository.findByProductId(productId).orElseThrow(
                () -> new ProductNotFoundException("The Product are not Found By this Product Id" + productId)
        );
    }

    @Override
    public List<Product> getAllProductsOfCategoryById(UUID categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new CategoryNotFoundException("Category is not present by this id " + categoryId);
        }
        return productRepository.findByCategory_CategoryId(categoryId).orElseThrow(
                () -> new ProductNotFoundException("The Product are not Found By this Category Id" + categoryId)
        );
    }

    @Override
    public List<Product> getAllProductsOfVendor(UUID vendorId) {
        return productRepository.findByVendor_VendorId(vendorId).orElseThrow(
                () -> new ProductNotFoundException("The Product are not Found By this vendorId " + vendorId)
        );
    }


    private Vendor validateVendor(UUID userId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new AccessDeniedException("Vendor not found"));

        if (vendor.getVerificationStatus() != VerificationStatus.APPROVED
                || !vendor.getIsActive()) {
            throw new AccessDeniedException("Vendor not approved");
        }
        return vendor;
    }

    @Override
    @Transactional
    public ProductResponseDto updateProduct(UUID userId, UUID productId, UpdateProductRequestDto request) {

        Vendor vendor = validateVendor(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!product.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Product does not belong to vendor");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setIsAvailable(request.getIsAvailable());

        productRepository.save(product);

        return ProductResponseDto.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .isAvailable(product.getIsAvailable())
                .build();
    }

    public Page<ProductListItemDto> listProducts(UUID userId, UUID categoryId, Boolean isAvailable, Pageable pageable) {
        Vendor vendor = validateVendor(userId);

        Page<Product> page;

        if (categoryId != null && isAvailable != null) {
            page = productRepository
                    .findByVendor_VendorIdAndCategory_CategoryIdAndIsAvailable(
                            vendor.getVendorId(), categoryId, isAvailable, pageable);
        } else if (categoryId != null) {
            page = productRepository
                    .findByVendor_VendorIdAndCategory_CategoryId(
                            vendor.getVendorId(), categoryId, pageable);
        } else if (isAvailable != null) {
            page = productRepository
                    .findByVendor_VendorIdAndIsAvailable(
                            vendor.getVendorId(), isAvailable, pageable);
        } else {
            page = productRepository
                    .findByVendor_VendorId(
                            vendor.getVendorId(), pageable);
        }

        return page.map(p -> ProductListItemDto.builder()
                .productId(p.getProductId())
                .name(p.getName())
                .price(p.getPrice())
                .stock(p.getStock())
                .isAvailable(p.getIsAvailable())
                .categoryId(p.getCategory().getCategoryId())
                .build());
    }

    @Override
    @Transactional
    public void deleteProduct(UUID userId, UUID productId) {

        Vendor vendor = validateVendor(userId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!product.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Product does not belong to vendor");
        }

        // Soft delete
        product.setIsAvailable(false);
        productRepository.save(product);
    }

    private Vendor validateVendorAccess(UUID userId) {
        Vendor vendor = vendorRepository.findByUserId(userId).orElseThrow(() -> new AccessDeniedException("Vendor not found"));

        if (vendor.getVerificationStatus() != VerificationStatus.APPROVED || !vendor.getIsActive()) {
            throw new AccessDeniedException("Vendor not approved");
        }
        return vendor;
    }
}
