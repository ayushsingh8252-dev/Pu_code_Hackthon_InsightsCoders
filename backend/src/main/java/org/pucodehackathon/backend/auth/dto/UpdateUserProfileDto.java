package org.pucodehackathon.backend.auth.dto;

import lombok.Data;

@Data
public class UpdateUserProfileDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String image;

}
