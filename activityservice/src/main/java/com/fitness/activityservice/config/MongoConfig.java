package com.fitness.activityservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig {
//    use this class for enabling auditing feature(which supports createdAt,lastModifiedat) of MongoDB
}
