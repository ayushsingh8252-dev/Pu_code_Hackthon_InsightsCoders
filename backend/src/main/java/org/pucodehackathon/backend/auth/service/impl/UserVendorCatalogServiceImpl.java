package org.pucodehackathon.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.auth.dto.userDto.CategoryWithProductsDto;
import org.pucodehackathon.backend.auth.dto.userDto.ProductItemDto;
import org.pucodehackathon.backend.auth.dto.userDto.VendorBasicDto;
import org.pucodehackathon.backend.auth.dto.userDto.VendorCatalogResponseDto;
import org.pucodehackathon.backend.auth.service.UserVendorCatalogService;
import org.pucodehackathon.backend.product.repositories.CategoryRepository;
import org.pucodehackathon.backend.product.repositories.ProductRepository;
import org.pucodehackathon.backend.vendor.model.Vendor;
import org.pucodehackathon.backend.vendor.model.VerificationStatus;
import org.pucodehackathon.backend.vendor.repositories.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserVendorCatalogServiceImpl implements UserVendorCatalogService {

    private final VendorRepository vendorRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public VendorCatalogResponseDto getVendorCatalog(UUID vendorId) {

        Vendor vendor = vendorRepository.findByVendorId(vendorId)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!vendor.getIsActive() || vendor.getVerificationStatus() != VerificationStatus.APPROVED) {
            throw new RuntimeException("Vendor not available");
        }

        VendorBasicDto vendorDto = VendorBasicDto.builder()
                .vendorId(vendor.getVendorId())
                .businessName(vendor.getBusinessName())
                .vendorType(vendor.getVendorType().name())
                .rating(vendor.getRatingAvg().toBigInteger().doubleValue())
                .build();

        List<CategoryWithProductsDto> categories = categoryRepository
                .findByVendor_VendorIdAndIsActiveTrue(vendorId)
                .stream()
                .map(category -> {

                    List<ProductItemDto> products = productRepository
                            .findByVendor_VendorIdAndCategory_CategoryIdAndIsAvailableTrue(
                                    vendorId,
                                    category.getCategoryId()
                            )
                            .stream()
                            .map(p -> ProductItemDto.builder()
                                    .productId(p.getProductId())
                                    .name(p.getName())
                                    .description(p.getDescription())
                                    .price(p.getPrice())
                                    .stock(p.getStock())
                                    .isAvailable(p.getIsAvailable())
                                    .build())
                            .toList();

                    return CategoryWithProductsDto.builder()
                            .categoryId(category.getCategoryId())
                            .categoryName(category.getName())
                            .products(products)
                            .build();
                })
                .toList();

        return VendorCatalogResponseDto.builder()
                .vendor(vendorDto)
                .categories(categories)
                .build();
    }
}
