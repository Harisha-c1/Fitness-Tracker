package com.fitness.gateway.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class userResponse {
    private String id;
    private String keycloakId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
