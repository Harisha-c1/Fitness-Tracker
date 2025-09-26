package com.fitness.dashboardservice.controller;

import com.fitness.dashboardservice.Service.DashboardService;
import com.fitness.dashboardservice.dto.DashboardResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }


    @GetMapping("/Today")
    public DashboardResponse getDailyDashboard(
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return dashboardService.getDailyDashboard(userId, date);
    }

    // Weekly
    @GetMapping("/Weekly")
    public DashboardResponse getWeeklyDashboard(
            @RequestParam String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return dashboardService.getWeeklyDashboard(userId, date);
    }


    @GetMapping("/Monthly")
    public DashboardResponse getMonthlyDashboard(
            @RequestParam String userId,
            @RequestParam String month) {
        YearMonth yearMonth = YearMonth.parse(month);
        return dashboardService.getMonthlyDashboard(userId, yearMonth);
    }
}
