package org.pucodehackathon.backend.vendor.dto;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
public class VendorAvailabilityRequestDto {
    private DayOfWeek dayOfWeek;
    private LocalTime openTime;
    private LocalTime closeTime;
}