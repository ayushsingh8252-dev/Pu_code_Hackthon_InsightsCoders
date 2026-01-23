package org.pucodehackathon.backend.admin.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;

@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/v1/admin/...")
public class AdminAuditController {
}
