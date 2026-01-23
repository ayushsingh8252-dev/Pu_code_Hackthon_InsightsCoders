package org.pucodehackathon.backend.exception.vendor_exceptions;

public class VendorAlreadyVerifiedException extends RuntimeException {
    public VendorAlreadyVerifiedException(String message) {
        super(message);
    }
}
