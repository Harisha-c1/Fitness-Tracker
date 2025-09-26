package com.fitness.aiservice.dto;

import lombok.Data;


@Data
public class AIChatResponse {
    private String answer;

    public AIChatResponse(String answer) {
        this.answer = answer;
    }

}
