package org.pucodehackathon.backend.admin.specification;



import org.pucodehackathon.backend.vendor.model.Vendor;
import org.springframework.data.jpa.domain.Specification;

public class VendorSpecifications {

    public static Specification<Vendor> hasStatus(String status) {
        return (root, query, cb) ->
                status == null ? null :
                        cb.equal(root.get("verificationStatus"), status);
    }

    public static Specification<Vendor> isActive(Boolean active) {
        return (root, query, cb) ->
                active == null ? null :
                        cb.equal(root.get("isActive"), active);
    }
}