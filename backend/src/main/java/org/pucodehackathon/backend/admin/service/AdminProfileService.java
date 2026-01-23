package org.pucodehackathon.backend.admin.service;


import org.pucodehackathon.backend.admin.dto.AdminProfileResponse;
import org.pucodehackathon.backend.helper.UserPrincipal;

public interface AdminProfileService {
    AdminProfileResponse getProfile(UserPrincipal principal);
}