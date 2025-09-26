package com.fitness.dashboardservice.repo;

import com.fitness.dashboardservice.model.UserActivity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface userActivityRepository extends MongoRepository<UserActivity, String> {
//    List<UserActivity> findByUserIdAndStartTimeBetween(String userId, LocalDateTime start, LocalDateTime end);
    List<UserActivity> findByUserIdAndCreatedAtBetween(String userId, LocalDateTime start, LocalDateTime end);
    void deleteByActivityIdAndUserId(String id, String userId);
}


