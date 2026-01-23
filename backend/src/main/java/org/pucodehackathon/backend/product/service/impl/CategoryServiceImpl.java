package org.pucodehackathon.backend.product.service.impl;


import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.exception.product_exception.CategoryNotFoundException;
import org.pucodehackathon.backend.product.dto.CategoryListItemDto;
import org.pucodehackathon.backend.product.dto.CategoryResponseDto;
import org.pucodehackathon.backend.product.dto.CreateCategoryRequestDto;
import org.pucodehackathon.backend.product.dto.UpdateCategoryRequestDto;
import org.pucodehackathon.backend.product.model.Category;
import org.pucodehackathon.backend.product.repositories.CategoryRepository;
import org.pucodehackathon.backend.product.service.CategoryService;
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
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final VendorRepository vendorRepository;


    @Override
    public CategoryResponseDto createCategory(UUID userId, CreateCategoryRequestDto request) {
        Vendor vendor = validateVendorAccess(userId);

        Category category = Category.builder()
                .vendor(vendor)
                .name(request.getName())
                .description(request.getDescription())
                .build();


        Category savedCategory = categoryRepository.save(category);

        return CategoryResponseDto.builder()
                .categoryId(savedCategory.getCategoryId())
                .name(savedCategory.getName())
                .isActive(savedCategory.getIsActive())
                .build();
    }

    @Override
    public Category getCategoryById(UUID categoryId) {
        return categoryRepository.findByCategoryId(categoryId).orElseThrow(
                () -> new CategoryNotFoundException("The Category is Not Found by This Id " + categoryId)
        );
    }

    @Override
    public List<Category> getAllCategoryByVendorId(UUID vendorId) {
        return categoryRepository.findByVendor_VendorId(vendorId).orElseThrow(
                () -> new CategoryNotFoundException("The Category is Not Found by This Id " + vendorId)
        );
    }

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(UUID userId, UUID categoryId, UpdateCategoryRequestDto request) {

        Vendor vendor = validateVendor(userId);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        if (!category.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Category does not belong to vendor");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIsActive(request.getIsActive());

        categoryRepository.save(category);

        return CategoryResponseDto.builder()
                .categoryId(category.getCategoryId())
                .name(category.getName())
                .isActive(category.getIsActive())
                .build();
    }

    @Override
    @Transactional
    public void deleteCategory(UUID userId, UUID categoryId) {

        Vendor vendor = validateVendor(userId);

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        if (!category.getVendor().getVendorId().equals(vendor.getVendorId())) {
            throw new AccessDeniedException("Category does not belong to vendor");
        }

        // Soft delete
        category.setIsActive(false);
        categoryRepository.save(category);
    }



    public Page<CategoryListItemDto> listCategories(UUID userId, Boolean isActive, Pageable pageable) {
        Vendor vendor = validateVendor(userId);

        Page<Category> page = (isActive == null)
                ? categoryRepository.findByVendor_VendorId(
                vendor.getVendorId(), pageable)
                : categoryRepository.findByVendor_VendorIdAndIsActive(
                vendor.getVendorId(), isActive, pageable);

        return page.map(cat -> CategoryListItemDto.builder()
                .categoryId(cat.getCategoryId())
                .name(cat.getName())
                .isActive(cat.getIsActive())
                .build());
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

    private Vendor validateVendorAccess(UUID userId) {
        Vendor vendor = vendorRepository.findByUserId(userId)
                .orElseThrow(() -> new AccessDeniedException("Vendor not found"));

        if (vendor.getVerificationStatus() != VerificationStatus.APPROVED
                || !vendor.getIsActive()) {
            throw new AccessDeniedException("Vendor not approved");
        }
        return vendor;
    }
}
