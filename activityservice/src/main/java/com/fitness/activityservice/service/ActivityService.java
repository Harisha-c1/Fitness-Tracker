package com.fitness.activityservice.service;

import com.fitness.activityservice.Repo.ActivityRepo;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import com.fitness.activityservice.model.ActivityType;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);
    private final UserValidationService userValidationService;
    private final ActivityRepo activityRepo;
    @Value("${spring.rabbitmq.template.exchange}")
    private String exchange;
    @Value("${spring.rabbitmq.template.routing-key}")
    private String routingKey;

    private final RabbitTemplate rabbitTemplate;


    public ActivityResponse trackActivity(ActivityRequest request) {

         boolean isvalidUser=userValidationService.validateUserName(request.getUserId());
         if(!isvalidUser){
             throw new RuntimeException("Invalid username or Bad Request");
         }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();
        Activity savedActivity = activityRepo.save(activity);

        //publish to rabbitMq for AI Service
        try{
            rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
        }catch (Exception e){
            log.error("Failed to publish activity : ", e);
        }
        return mapToResponse(savedActivity);

    }
    private ActivityResponse mapToResponse(Activity activity){
        ActivityResponse activityResponse = new ActivityResponse();
        activityResponse.setId(activity.getId());
        activityResponse.setUserId(activity.getUserId());
        activityResponse.setType(activity.getType());
        activityResponse.setDuration(activity.getDuration());
        activityResponse.setCaloriesBurned(activity.getCaloriesBurned());
        activityResponse.setStartTime(activity.getStartTime());
        activityResponse.setAdditionalMetrics(activity.getAdditionalMetrics());
        activityResponse.setCreatedAt(activity.getCreatedAt());
        activityResponse.setUpdatedAt(activity.getUpdatedAt());
        return activityResponse;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
       List<Activity> activity= activityRepo.findByUserId(userId);
       return activity.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
       return activityRepo.findById(activityId).map(this::mapToResponse).orElseThrow(()->new RuntimeException("Activity not found of id:"+activityId));
    }

    public String deleteActivity(String userId, String activityId) {
        int result=activityRepo.deleteByIdAndUserId(activityId,userId);

        if(result>0){

            Activity deletedActivity=new Activity();
            deletedActivity.setType(ActivityType.ACTIVITY_DELETED);
            deletedActivity.setUserId(userId);
            deletedActivity.setId(activityId);

            try{
                rabbitTemplate.convertAndSend(exchange, routingKey, deletedActivity);
                return "Successfully Deleted";
            }catch (Exception e){

                log.error("Failed to Delete activity : ", e);
            }
        }
        return "Delete Failed";
    }
}
