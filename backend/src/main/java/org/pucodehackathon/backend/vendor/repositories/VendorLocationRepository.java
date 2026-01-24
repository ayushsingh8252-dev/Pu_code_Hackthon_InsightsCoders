package org.pucodehackathon.backend.vendor.repositories;

import org.pucodehackathon.backend.vendor.model.VendorLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VendorLocationRepository extends JpaRepository<VendorLocation, UUID> {
    List<VendorLocation> findByVendor_VendorId(UUID vendorId);

    Optional<VendorLocation> findByVendor_VendorIdAndIsLiveTrue(UUID vendorId);

    Optional<VendorLocation> findByVendor_VendorIdAndIsPrimaryTrue(UUID vendorId);


    @Query(value = """
                SELECT 
                  BIN_TO_UUID(v.vendor_id) AS vendorId,
                  v.business_name AS businessName,
                  v.vendor_type AS vendorType,
                  vl.latitude AS latitude,
                  vl.longitude AS longitude,
                  (
                    6371 * acos(
                      cos(radians(:lat)) *
                      cos(radians(vl.latitude)) *
                      cos(radians(vl.longitude) - radians(:lng)) +
                      sin(radians(:lat)) *
                      sin(radians(vl.latitude))
                    )
                  ) AS distanceKm
                FROM vendor v
                JOIN vendor_location vl ON v.vendor_id = vl.vendor_id
                WHERE v.is_active = true
                  AND vl.latitude IS NOT NULL
                  AND vl.longitude IS NOT NULL
                HAVING distanceKm <= :radiusKm
                ORDER BY distanceKm
            """, nativeQuery = true)
    List<Object[]> findNearbyRaw(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm
    );

    @Query(value = """
                SELECT 
                  HEX(v.vendor_id) AS vendorId,
                  v.business_name AS businessName,
                  v.vendor_type AS vendorType,
                  vc.name AS categoryName,
                  vl.latitude AS latitude,
                  vl.longitude AS longitude,
                  (
                    6371 * acos(
                      cos(radians(:lat)) *
                      cos(radians(vl.latitude)) *
                      cos(radians(vl.longitude) - radians(:lng)) +
                      sin(radians(:lat)) *
                      sin(radians(vl.latitude))
                    )
                  ) AS distanceKm
                FROM vendor v
                JOIN vendor_location vl ON v.vendor_id = vl.vendor_id
                JOIN vendor_category vc ON vc.vendor_id = v.vendor_id
                WHERE v.is_active = true
                  AND vc.is_active = true
                  AND vc.name = :category
                  AND vl.latitude IS NOT NULL
                  AND vl.longitude IS NOT NULL
                HAVING distanceKm <= :radiusKm
                ORDER BY distanceKm
            """, nativeQuery = true)
    List<Object[]> findNearbyByCategoryRaw(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm,
            @Param("category") String category
    );
}