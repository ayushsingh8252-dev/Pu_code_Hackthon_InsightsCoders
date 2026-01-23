package org.pucodehackathon.backend.product.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.product.dto.CategoryListItemDto;
import org.pucodehackathon.backend.product.dto.CategoryResponseDto;
import org.pucodehackathon.backend.product.dto.CreateCategoryRequestDto;
import org.pucodehackathon.backend.product.dto.UpdateCategoryRequestDto;
import org.pucodehackathon.backend.product.model.Category;
import org.pucodehackathon.backend.product.service.CategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendor/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class VendorCategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponseDto> createCategory(Authentication auth, @RequestBody @Valid CreateCategoryRequestDto request) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        assert principal != null;
        return ResponseEntity.ok(categoryService.createCategory(principal.getUser().getId(), request));
    }


    @GetMapping("/{categoryId}")
    public ResponseEntity<Category> getCategoryById(@PathVariable UUID categoryId) {
        Category response = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<List<Category>> getAllCategoriesOfVendor(@PathVariable UUID vendorId) {
        List<Category> response = categoryService.getAllCategoryByVendorId(vendorId);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/{categoryId}")
    public ResponseEntity<CategoryResponseDto> updateCategory(Authentication auth, @PathVariable UUID categoryId, @RequestBody @Valid UpdateCategoryRequestDto request) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                categoryService.updateCategory(
                        principal.getUser().getId(),
                        categoryId,
                        request
                )
        );
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(Authentication auth, @PathVariable UUID categoryId) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        categoryService.deleteCategory(principal.getUser().getId(), categoryId);
        return ResponseEntity.noContent().build();
    }



    @GetMapping
    public Page<CategoryListItemDto> listCategories(Authentication auth, @RequestParam(required = false) Boolean isActive, @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return categoryService.listCategories(
                principal.getUser().getId(),
                isActive,
                pageable
        );
    }

}
