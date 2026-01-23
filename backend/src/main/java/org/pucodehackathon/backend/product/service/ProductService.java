package org.pucodehackathon.backend.product.service;

import org.pucodehackathon.backend.product.dto.CreateProductRequestDto;
import org.pucodehackathon.backend.product.dto.ProductResponseDto;
import org.pucodehackathon.backend.product.dto.UpdateProductRequestDto;
import org.pucodehackathon.backend.product.model.Product;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductResponseDto createProduct(UUID userId, CreateProductRequestDto request);

    Product getProductById(UUID productId);

    List<Product> getAllProductsOfCategoryById(UUID categoryId);

    List<Product> getAllProductsOfVendor(UUID vendorId);

    ProductResponseDto updateProduct(UUID userId, UUID productId, UpdateProductRequestDto request);

    void deleteProduct(UUID userId, UUID productId);
}
