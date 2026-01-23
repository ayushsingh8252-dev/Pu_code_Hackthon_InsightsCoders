package org.pucodehackathon.backend.vendor.service;

import java.util.UUID;

public interface NearbyVendorProjection {

    UUID getVendorId();
    String getBusinessName();
    String getVendorType();

    Double getLatitude();
    Double getLongitude();

    Double getDistanceKm();
    Double getRatingAvg();
    Boolean getIsLive();
}
