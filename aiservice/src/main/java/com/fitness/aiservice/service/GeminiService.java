//package com.fitness.aiservice.service;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//import java.util.Map;
//
//@Service
//
//public class GeminiService {
//    @Value("${gemini.api.url}")
//    private String geminiApiUri;
//
//    @Value("${gemini.api.key}")
//    private String geminiApiKey;
//
//    private final WebClient webClient;
//    public GeminiService(WebClient.Builder webClientBuilder) {
//        this.webClient = webClientBuilder.build();
//    }
//    public String getAnswer(String question) {
//        //Building the required format to send request to ai
//        Map<String,Object> requestBody=Map.of(
//                "contents",new Object[]{
//                        Map.of("parts",new Object[]{
//                                Map.of("text",question)})
//                }
//        );
//
//        // sendinng the request to ai through webflux
//
//            return webClient.post()
//                    .uri(geminiApiUri+geminiApiKey)
//                    .header("Content-Type","application/json")
//                    .bodyValue(requestBody)
//                    .retrieve()
//                    .bodyToMono(String.class)
//                    .block();
//
//    }
//}
package com.fitness.aiservice.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {
    @Value("${gemini.api.url}")
    private String geminiApiUri;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final WebClient geminiWebClient;



    public String getAnswer(String question) {

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", question)
                        ))
                )
        );

        try {
            return geminiWebClient.post()
                    .uri("/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)  // Jackson now serializes it properly
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (WebClientResponseException e) {
            System.out.println(e.getResponseBodyAsString());
            System.out.println(e.getStatusCode());
            throw new RuntimeException("The Message is "+ e.getResponseBodyAsString());
        }
    }
}
