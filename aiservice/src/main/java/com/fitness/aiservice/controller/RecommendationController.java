package com.fitness.aiservice.controller;

import com.fitness.aiservice.dto.AIChatRequest;
import com.fitness.aiservice.dto.AIChatResponse;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.service.ChatAiService;
import com.fitness.aiservice.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommendation")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final ChatAiService chatAiService;
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendations(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.getUserRecommendation(userId));
    }

    @GetMapping("/activity/{activityId}")
    public ResponseEntity<Recommendation> getActivityRecommendations(@PathVariable String activityId) {
        return ResponseEntity.ok(recommendationService.getActivityRecommendation(activityId));
    }

    @PostMapping("/ask")
    public AIChatResponse askCoach(@RequestBody AIChatRequest request) {
        String answer = chatAiService.getCoachAnswer(
                request.getQuestion(),request.getUserId(),request.getDate()
        );
        return new AIChatResponse(answer);
    }
}
