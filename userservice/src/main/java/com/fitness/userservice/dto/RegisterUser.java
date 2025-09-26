package com.fitness.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NonNull;

@Data
public class RegisterUser {
    @NotBlank
    private String userName;
    @NotBlank
    @Email(message = "Email required")
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private int age;
}
