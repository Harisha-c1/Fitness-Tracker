# Fitness App

A microservices-based fitness application built with **Spring Boot**, **MongoDB**, and **React**. The app allows users to track activities, set fitness goals, receive AI-based recommendations, and view their stats on a dashboard. The project follows real-world best practices, including microservices architecture, service discovery, asynchronous messaging, and API communication.  

---

## Features

- **User Management**: Register, login, and manage user profiles.  
- **Activity Tracking**: Add and track fitness activities with duration, calories burned, and other metrics.  
- **Goal Tracking**: Set daily calorie goals and get notifications when goals are met.  
- **AI Recommendations**: Receive activity-based recommendations using AI service.  
- **Dashboard**: View consolidated stats and activity summaries.  
- **Real-Time Updates**: Dashboard receives activity updates via **RabbitMQ**.  

---

## Architecture

The project follows a **microservices architecture**:

- **User Service** – manages user data.  
- **Activity Service** – handles user activities.  
- **AI Service** – generates personalized recommendations.  
- **Dashboard Service** – aggregates stats and activity info; uses WebClient for service communication and RabbitMQ for activity updates.  
- **Gateway Service** – API gateway for routing requests.  
- **Eureka Server** – service discovery.  

**Communication Patterns:**  
- **WebClient** – synchronous inter-service communication.  
- **RabbitMQ** – asynchronous messaging between Activity Service, AI Service, and Dashboard Service.  

---

## Tech Stack

- **Backend:** Spring Boot, Spring WebFlux, Spring Data MongoDB, Spring AMQP, Spring Data MySQL
- **Frontend:** React, Material UI, Framer Motion (animations)  
- **Database:** MongoDB,MySQL
- **Messaging:** RabbitMQ  
- **Service Discovery:** Eureka Server  
- **API Communication:** WebClient, REST  

---

## Setup Instructions

### Prerequisites

- Java 17+  
- Maven 3+  
- Node.js 18+  
- MongoDB  
- RabbitMQ  
- MySQL

### Backend Setup

1. Clone the repository:  
```bash
git clone <repository-url>
