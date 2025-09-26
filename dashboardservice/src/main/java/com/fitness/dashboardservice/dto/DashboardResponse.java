package com.fitness.dashboardservice.dto;

import com.fitness.dashboardservice.model.UserActivity;
import lombok.Data;

import java.util.List;
import java.util.Map;
@Data
public class DashboardResponse {
    private int totalCalories;
    private int totalDuration;
    private Map<String, Integer> caloriesByActivity;
    private List<UserActivity> activities;

    public DashboardResponse(int totalCalories, int totalDuration,
                             Map<String, Integer> caloriesByActivity,
                             List<UserActivity> activities) {
        this.totalCalories = totalCalories;
        this.totalDuration = totalDuration;
        this.caloriesByActivity = caloriesByActivity;
        this.activities = activities;
    }
}
