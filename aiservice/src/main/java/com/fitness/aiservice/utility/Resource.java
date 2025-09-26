package com.fitness.aiservice.utility;

import com.fitness.aiservice.dto.UserProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class Resource {
    private final WebClient profilewebClient;
    private final WebClient dashboardWebClient;

    public UserProfile getUserProfile(String userId) {

        try {
            return  profilewebClient
                    .get()
                    .uri("http://USER-SERVICE/api/users/{userId}",userId)
                    .retrieve()
                    .bodyToMono(UserProfile.class)
                    .block();



        } catch (Exception e) {
            System.out.println("something went wrong"+ e.getMessage());

        }
        return new UserProfile();
    }
    public String getUserData(String userId ,LocalDate date) {

        try {
            return  dashboardWebClient
                    .get()
                    .uri(uriBuilder -> uriBuilder.path("/api/dashboard/Today")
                            .queryParam("userId",userId)
                            .queryParam("date",date)
                            .build())
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (Exception e) {
            System.out.println("something went wrong"+ e.getMessage());

        }
        return "No Activities Found";
    }
}
