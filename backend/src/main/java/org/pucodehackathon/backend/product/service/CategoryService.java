package org.pucodehackathon.backend.product.service;

import org.pucodehackathon.backend.product.dto.CategoryListItemDto;
import org.pucodehackathon.backend.product.dto.CategoryResponseDto;
import org.pucodehackathon.backend.product.dto.CreateCategoryRequestDto;
import org.pucodehackathon.backend.product.dto.UpdateCategoryRequestDto;
import org.pucodehackathon.backend.product.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
     CategoryResponseDto createCategory(UUID userId, CreateCategoryRequestDto request);
     Category getCategoryById(UUID categoryId);
     List<Category> getAllCategoryByVendorId(UUID vendorId);
     void deleteCategory(UUID userId, UUID categoryId);
     CategoryResponseDto updateCategory(UUID userId, UUID categoryId, UpdateCategoryRequestDto request);
     Page<CategoryListItemDto> listCategories(UUID userId, Boolean isActive, Pageable pageable);
}
