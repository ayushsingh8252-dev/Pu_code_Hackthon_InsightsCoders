package org.pucodehackathon.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignupRequestDto {
    private static final String PASSWORD_REGEX =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,16}$";

    @Email
    @NotNull(message = "Email Should no be Empty")
    private String email;

    @Size(min = 8, max = 16, message = "Password must be between 8 and 16 characters")
    @Pattern(regexp = PASSWORD_REGEX, message = "Password must meet complexity requirements")
    private String password;


    @Pattern(
            regexp = "^$|^\\d{10}$",
            message = "Phone must be empty or exactly 10 digits"
    )
    private String phoneNumber;

    @NotNull(message = "First name should not be empty")
    private String firstName;

    @NotNull(message = "Last Name should not be Empty")
    private String lastName;

    private String image;

}
