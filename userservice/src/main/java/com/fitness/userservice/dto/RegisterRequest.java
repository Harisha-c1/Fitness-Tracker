package com.fitness.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    @NotBlank(message = "Email is Required")
    @Email(message = "Email is Required")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min=6,message = "password must have atleast 6 Characters")
    private String password;
    private String keycloakId;
    private int age;


}
