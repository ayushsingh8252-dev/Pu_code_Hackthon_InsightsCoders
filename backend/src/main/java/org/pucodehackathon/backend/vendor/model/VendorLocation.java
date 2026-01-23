package org.pucodehackathon.backend.vendor.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;
@Entity
@Table(
        name = "vendor_location",
        indexes = {
                @Index(name = "idx_vendor_location_vendor_id", columnList = "vendor_id"),
                @Index(name = "idx_vendor_location_updated", columnList = "last_updated_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "location_id", updatable = false, nullable = false)
    private UUID locationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    /* ---------- Address (ONLY for FIXED vendors) ---------- */
    @Column(name = "address_line")
    private String addressLine;

    @Column(name = "area")
    private String area;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "country")
    private String country;

    @Column(name = "pincode")
    private String pincode;

    /* ---------- Geo ---------- */
    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    /* ---------- Flags ---------- */
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;   // FIXED vendor

    @Column(name = "is_live", nullable = false)
    private Boolean isLive;      // MOBILE vendor

    private Float accuracy;

    /* ---------- Tracking ---------- */
    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.lastUpdatedAt = LocalDateTime.now();

        if (this.isPrimary == null) this.isPrimary = false;
        if (this.isLive == null) this.isLive = false;
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdatedAt = LocalDateTime.now();
    }
}
