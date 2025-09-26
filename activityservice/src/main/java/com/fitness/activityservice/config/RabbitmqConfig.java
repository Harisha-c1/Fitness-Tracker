package com.fitness.activityservice.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spring.rabbitmq.template")
public class RabbitmqConfig {

    @Value("${spring.rabbitmq.template.exchange}")
    private String exchange;
    @Value("${spring.rabbitmq.template.routing-key}")
    private String routingKey;
    @Value("${spring.rabbitmq.template.default-receive-queue}")
    private String queue;

    @Bean
    public Queue activityQueue() {
        // durable means that tells rabbitmq to keep the queue alive even the rabbitmq restarts
        return new Queue(queue,true);
    }
    @Bean
    public Queue dashboardQueue() {
        return new Queue("activity.dashboard.queue", true);
    }
    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    @Bean
    public Binding dashboardBinding(Queue dashboardQueue, DirectExchange activityExchange) {
        return BindingBuilder.bind(dashboardQueue).to(activityExchange).with(routingKey);
    }
    @Bean
    public DirectExchange activityExchange() {
        return new DirectExchange(exchange);
    }
    @Bean
    public Binding activityBinding(Queue activityQueue, DirectExchange activityExchange) {
        return BindingBuilder.bind(activityQueue).to(activityExchange).with(routingKey);
    }




}
