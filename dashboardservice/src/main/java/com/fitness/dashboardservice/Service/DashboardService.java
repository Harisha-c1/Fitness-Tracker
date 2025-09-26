package com.fitness.dashboardservice.Service;

import com.fitness.dashboardservice.dto.DashboardResponse;
import com.fitness.dashboardservice.model.UserActivity;
import com.fitness.dashboardservice.repo.userActivityRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    private final userActivityRepository repository;

    public DashboardService(userActivityRepository repository) {
        this.repository = repository;
    }

    public DashboardResponse getDailyDashboard(String userId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<UserActivity> activities = repository.findByUserIdAndCreatedAtBetween(userId, start, end);

        return buildDashboardResponse(activities);
    }

    public DashboardResponse getWeeklyDashboard(String userId, LocalDate weekDate) {
        // Start from Monday of the given week
        LocalDate startOfWeek = weekDate.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusWeeks(1);

        LocalDateTime start = startOfWeek.atStartOfDay();
        LocalDateTime end = endOfWeek.atStartOfDay();

        List<UserActivity> activities = repository.findByUserIdAndCreatedAtBetween(userId, start, end);

        return buildDashboardResponse(activities);
    }

    public DashboardResponse getMonthlyDashboard(String userId, YearMonth month) {
        LocalDate startOfMonth = month.atDay(1);
        LocalDate endOfMonth = month.plusMonths(1).atDay(1);

        LocalDateTime start = startOfMonth.atStartOfDay();
        LocalDateTime end = endOfMonth.atStartOfDay();

        List<UserActivity> activities = repository.findByUserIdAndCreatedAtBetween(userId, start, end);

        return buildDashboardResponse(activities);
    }

    // Aggregation logic
    private DashboardResponse buildDashboardResponse(List<UserActivity> activities) {
        int totalCalories = activities.stream().mapToInt(UserActivity::getCaloriesBurned).sum();
        int totalDuration = activities.stream().mapToInt(UserActivity::getDuration).sum();

        Map<String, Integer> caloriesByActivity = activities.stream()
                .collect(Collectors.groupingBy(UserActivity::getType,
                        Collectors.summingInt(UserActivity::getCaloriesBurned)));

        return new DashboardResponse(totalCalories, totalDuration, caloriesByActivity, activities);
    }
}

