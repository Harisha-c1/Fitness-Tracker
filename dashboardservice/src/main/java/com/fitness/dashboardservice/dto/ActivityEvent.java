package com.fitness.dashboardservice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
@Data
public class ActivityEvent {
    private String id;
    private String userId;
    private String activityId;
    private String type;
    private int duration;
    private int caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
