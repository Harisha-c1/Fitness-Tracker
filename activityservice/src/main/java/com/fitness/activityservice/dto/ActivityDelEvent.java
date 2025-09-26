package com.fitness.activityservice.dto;

import lombok.Data;

@Data
public class ActivityDelEvent {
    private String eventType;
    private String activityId;
    private String userId;

    public ActivityDelEvent(String activityDeleted, String activityId, String userId) {
        this.eventType = activityDeleted;
        this.activityId = activityId;
        this.userId = userId;
    }
}
