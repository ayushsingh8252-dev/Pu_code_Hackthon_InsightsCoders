package org.pucodehackathon.backend.product.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.helper.UserPrincipal;
import org.pucodehackathon.backend.product.dto.CreateProductRequestDto;
import org.pucodehackathon.backend.product.dto.ProductListItemDto;
import org.pucodehackathon.backend.product.dto.ProductResponseDto;
import org.pucodehackathon.backend.product.dto.UpdateProductRequestDto;
import org.pucodehackathon.backend.product.model.Product;
import org.pucodehackathon.backend.product.service.ProductImageService;
import org.pucodehackathon.backend.product.service.impl.ImageUploadService;
import org.pucodehackathon.backend.product.service.impl.ProductServiceImpl;
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
@RequestMapping("/api/v1/vendor/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VENDOR')")
public class VendorProductController {

    private final ProductServiceImpl productService;
    private final ImageUploadService imageUploadService;
    private final ProductImageService productImageService;

    @PostMapping
    public ResponseEntity<ProductResponseDto> createProduct(Authentication auth, @RequestBody @Valid CreateProductRequestDto request) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(productService.createProduct(principal.getUser().getId(), request));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable UUID productId){
        Product response = productService.getProductById(productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategoryId(@PathVariable UUID categoryId){
        List<Product> response = productService.getAllProductsOfCategoryById(categoryId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{vendorId}")
    public ResponseEntity<List<Product>> getProductsByVendorId(@PathVariable UUID vendorId){
        List<Product> response = productService.getAllProductsOfVendor(vendorId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponseDto> updateProduct(Authentication auth, @PathVariable UUID productId, @RequestBody @Valid UpdateProductRequestDto request) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return ResponseEntity.ok(
                productService.updateProduct(
                        principal.getUser().getId(),
                        productId,
                        request
                )
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(Authentication auth, @PathVariable UUID productId) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        productService.deleteProduct(principal.getUser().getId(), productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public Page<ProductListItemDto> listProducts(
            Authentication auth,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) Boolean isAvailable,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        return productService.listProducts(
                principal.getUser().getId(),
                categoryId,
                isAvailable,
                pageable
        );
    }

}
