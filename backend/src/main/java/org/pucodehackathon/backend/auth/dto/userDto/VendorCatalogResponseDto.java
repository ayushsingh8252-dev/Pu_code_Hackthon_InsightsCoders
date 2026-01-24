package org.pucodehackathon.backend.auth.dto.userDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class VendorCatalogResponseDto {
    private VendorBasicDto vendor;
    private List<CategoryWithProductsDto> categories;
}
