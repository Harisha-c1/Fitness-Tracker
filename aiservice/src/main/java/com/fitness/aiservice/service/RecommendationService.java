package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repo.Recommendationrepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final Recommendationrepo recommendationrepo;

    public List<Recommendation> getUserRecommendation(String userId) {
       return recommendationrepo.findByUserId(userId);

    }

    public Recommendation  getActivityRecommendation(String activityId) {
        return recommendationrepo.findByActivityId(activityId)
                .orElseThrow(()-> new RuntimeException("activityId not found"));
    }
}
