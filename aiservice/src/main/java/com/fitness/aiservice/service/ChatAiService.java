package com.fitness.aiservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.aiservice.dto.UserProfile;
import com.fitness.aiservice.utility.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ChatAiService {
    private final GeminiService geminiService;
    private final ObjectMapper mapper = new ObjectMapper();
    private final Resource resource;

    public String getChatAnswer(String question, String userProfile, String dashboard) {

        StringBuilder sb = new StringBuilder();
        sb.append("You are a friendly fitness coach.\n");

        if (userProfile != null) {
            sb.append("User profile:\n").append(userProfile).append("\n");
        }
        if (dashboard != null) {
            sb.append("Recent analytics:\n").append(dashboard).append("\n");
        }

        sb.append("The user asks: \"").append(question).append("\"\n");
        sb.append("If the user asks is related to greetings, fitness,health,userProfile,Recent analytics then Answer in 2-3 sentences maximum, like a personal coach giving quick advice. or just reply with 'Please ask Fitness related question!'\n");

        String finalPrompt = sb.toString();

        String rawResponse=geminiService.getAnswer(finalPrompt);

       try{

        JsonNode rootNode = mapper.readTree(rawResponse);
        JsonNode textNode = rootNode.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text");

        if (textNode != null && !textNode.isMissingNode()) {
            return textNode.asText()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .replaceAll("\\*\\*([^*]+)\\*\\*", "$1") // remove bold
                    .replaceAll("\\*", "-")
                    .trim();
        }
    } catch (Exception e) {
      System.out.println(e.getMessage() +" meeeee");
    }

        return "Sorry, I couldn't generate a response.";

    }


    public String getCoachAnswer(String question, String userId, LocalDate date) {
        UserProfile getProfile=resource.getUserProfile(userId);
        String userProfile="Name :"+" " +getProfile.getFirstName()+","+"Age:"+" " + getProfile.getAge();
        String dashboard=resource.getUserData(userId,date);
        return getChatAnswer(question,userProfile,dashboard);
    }


}
