package org.pucodehackathon.backend.vendor.service.impl;

import lombok.RequiredArgsConstructor;
import org.pucodehackathon.backend.vendor.dto.VendorStatusRequestDto;
import org.pucodehackathon.backend.vendor.dto.VendorStatusResponseDto;
import org.pucodehackathon.backend.vendor.model.VendorAvailability;
import org.pucodehackathon.backend.vendor.model.VendorStatus;
import org.pucodehackathon.backend.vendor.repositories.VendorAvailabilityRepository;
import org.pucodehackathon.backend.vendor.repositories.VendorStatusRepository;
import org.pucodehackathon.backend.vendor.service.VendorStatusService;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorStatusServiceImpl implements VendorStatusService {

    private final VendorStatusRepository statusRepository;
    private final VendorAvailabilityRepository availabilityRepository;

    @Override
    public void updateStatus(UUID vendorId, VendorStatusRequestDto dto) {

        VendorStatus status = statusRepository.findById(vendorId)
                .orElse(new VendorStatus());

        status.setVendorId(vendorId);
        status.setIsOpen(dto.getIsOpen());
        status.setReason(dto.getReason());
        status.setLastUpdated(LocalDateTime.now());

        statusRepository.save(status);
    }

    @Override
    public VendorStatusResponseDto getStatus(UUID vendorId) {

        Optional<VendorStatus> statusOpt = statusRepository.findById(vendorId);

        DayOfWeek today = LocalDate.now().getDayOfWeek();

        VendorAvailability availability =
                availabilityRepository.findByVendor_VendorIdAndDayOfWeek(vendorId, today)
                        .orElse(null);

        boolean isOpen;
        String reason = null;

        if (statusOpt.isPresent()) {
            isOpen = statusOpt.get().getIsOpen();
            reason = statusOpt.get().getReason();
        } else if (availability != null) {
            LocalTime now = LocalTime.now();
            isOpen = !availability.getIsClosed()
                    && now.isAfter(availability.getOpenTime())
                    && now.isBefore(availability.getCloseTime());
        } else {
            isOpen = false;
        }

        return VendorStatusResponseDto.builder()
                .isOpen(isOpen)
                .openTime(availability != null ? availability.getOpenTime() : null)
                .closeTime(availability != null ? availability.getCloseTime() : null)
                .reason(reason)
                .build();
    }
}
