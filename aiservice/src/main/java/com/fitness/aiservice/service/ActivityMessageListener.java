package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repo.Recommendationrepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityMessageListener {
private  final ActivityAiService aiService;
private final Recommendationrepo recommendationrepo;
    @RabbitListener(queues ="activity.queue" )
    public void processActivity(Activity activity){
        log.info("Received activity for processing : {}",activity.getType());
        if ("ACTIVITY_DELETED".equals(activity.getType())) {
            recommendationrepo.deleteByActivityIdAndUserId(activity.getId(), activity.getUserId());

        }else{
        Recommendation recommendation = aiService.generateRecommendation(activity);
        recommendationrepo.save(recommendation);}
    }
}
