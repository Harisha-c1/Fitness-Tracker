package com.fitness.dashboardservice.Service;


import com.fitness.dashboardservice.dto.ActivityEvent;
import com.fitness.dashboardservice.model.UserActivity;
import com.fitness.dashboardservice.repo.userActivityRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class ActivityMessageListener {

    private final userActivityRepository userActivityRepo;

    public ActivityMessageListener(userActivityRepository userActivityRepo) {
        this.userActivityRepo = userActivityRepo;
    }

    @RabbitListener(queues ="activity.dashboard.queue" )
    public void processActivity(ActivityEvent event){
        if ("ACTIVITY_DELETED".equals(event.getType())) {
            userActivityRepo.deleteByActivityIdAndUserId(event.getId(), event.getUserId());
            System.out.println("🗑 Deleted activity " + event.getId() + " for user " + event.getUserId());
        }else{
        UserActivity activity = new UserActivity();
        activity.setActivityId(event.getId());
        activity.setUserId(event.getUserId());
        activity.setType(event.getType());
        activity.setDuration(event.getDuration());
        activity.setCaloriesBurned(event.getCaloriesBurned());
        activity.setStartTime(event.getStartTime());
        activity.setAdditionalMetrics(event.getAdditionalMetrics());
        activity.setCreatedAt(event.getCreatedAt());
        activity.setUpdatedAt(event.getUpdatedAt());
        userActivityRepo.save(activity);}
    }
}
