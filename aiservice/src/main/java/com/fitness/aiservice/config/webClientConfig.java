package com.fitness.aiservice.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration

public class webClientConfig {
    @Bean
    public WebClient.Builder externalWebClientBuilder() {
        return WebClient.builder();
    }
    @Bean
    public WebClient geminiWebClient(WebClient.Builder externalWebClientBuilder) {
        return externalWebClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }
    @Bean
    @LoadBalanced
    public WebClient.Builder loadBalancedWebClientBuilder() {
        return WebClient.builder();
    }

    @Bean
    public WebClient  profilewebClient(WebClient.Builder loadBalancedWebClientBuilder) {
        return loadBalancedWebClientBuilder.build();
    }
    @Bean
    public WebClient dashboardWebClient(WebClient.Builder loadBalancedWebClientBuilder) {
        return loadBalancedWebClientBuilder.baseUrl("http://DASHBOARDSERVICE").build();
    }
}
