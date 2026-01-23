package org.pucodehackathon.backend.vendor.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vendor_status")
@Getter
@Setter
public class VendorStatus {

    @Id
    private UUID vendorId;

    private Boolean isOpen;

    private String reason;

    private LocalDateTime lastUpdated;
}