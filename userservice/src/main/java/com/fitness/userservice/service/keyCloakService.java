package com.fitness.userservice.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitness.userservice.dto.RegisterUser;
import com.fitness.userservice.exception.UserAlreadyExist;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service

public class keyCloakService {

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    private final WebClient webClient;

    public keyCloakService(WebClient keycloakWebClient) {
        this.webClient = keycloakWebClient;
    }

    private String getServiceAccountToken() {

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);

       String response= webClient
                .post()
                .uri("/realms/fitness-oauth2/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(String.class)
                .block();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response);
            return json.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse access token", e);
        }
        }

    public String createUser(RegisterUser user) {
        String token = getServiceAccountToken();
        String keycloakId="";

        try {
            webClient
                  .post()
                  .uri( "/admin/realms/" + realm + "/users")
                  .header("Authorization", "Bearer " + token)
                  .contentType(MediaType.APPLICATION_JSON)
                  .bodyValue(Map.of(
                          "username", user.getUserName(),
                          "firstName", user.getFirstName(),
                          "lastName", user.getLastName(),
                          "email", user.getEmail(),
                          "enabled", true,
                          "credentials", List.of(Map.of(
                                  "type", "password",
                                  "value", user.getPassword(),
                                  "temporary", false
                          ))
                  ))
                  .retrieve()
                  .bodyToMono(String.class)
                  .block();
        } catch (Exception e) {
            throw new UserAlreadyExist("User already exist");
        }


        List<Map<String,Object>> users = webClient
                .get()
                .uri("/admin/realms/" + realm + "/users?username=" + user.getUserName())
                .header("Authorization", "Bearer " + token)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String,Object>>>() {
                })
                .block();

        if (users != null && !users.isEmpty()) {
            keycloakId = (String) users.get(0).get("id");
        }


    if (keycloakId != null && !keycloakId.isBlank()) {
        return keycloakId;
    }

    throw new RuntimeException("Failed to extract Keycloak ID");
    }
}

