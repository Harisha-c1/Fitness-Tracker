package com.fitness.activityservice.Repo;

import com.fitness.activityservice.model.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepo extends MongoRepository<Activity,String> {
    List<Activity> findByUserId(String userId);
    int deleteByIdAndUserId(String id, String userId);
}
