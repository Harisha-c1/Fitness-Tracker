package com.fitness.aiservice.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AIChatRequest {
    private String userId;
    private String question;
    private LocalDate date;

}
