package com.fitness.activityservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUserName(String userId){
       try {


           return Boolean.TRUE.equals(userServiceWebClient.get()
                   .uri("/api/users/{userId}/validate", userId)
                   .retrieve()
                   .bodyToMono(boolean.class).block());
       }catch (WebClientResponseException e){
           if(e.getStatusCode() == HttpStatus.NOT_FOUND){
               throw new RuntimeException("User not found"+userId);
           }else if(e.getStatusCode() == HttpStatus.BAD_REQUEST){
               throw new RuntimeException("Invalid username or Bad Request");
           }
           throw new RuntimeException("Unknown Error in user service");

       }

    }

}
