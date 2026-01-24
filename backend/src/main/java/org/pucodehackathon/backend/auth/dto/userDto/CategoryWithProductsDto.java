package org.pucodehackathon.backend.auth.dto.userDto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class CategoryWithProductsDto {
    private UUID categoryId;
    private String categoryName;
    private List<ProductItemDto> products;
}
