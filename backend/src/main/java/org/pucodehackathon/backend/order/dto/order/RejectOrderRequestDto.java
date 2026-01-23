package org.pucodehackathon.backend.order.dto.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RejectOrderRequestDto {
    private String reason;
}