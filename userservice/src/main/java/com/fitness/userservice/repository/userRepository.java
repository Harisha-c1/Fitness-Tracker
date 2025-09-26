package com.fitness.userservice.repository;
import com.fitness.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories
public interface userRepository extends JpaRepository<User,String> {

    boolean existsByEmail(String email);

    Boolean existsBykeycloakId(String userId);

    User findByEmail(String email);

    User findByKeycloakId(String userId);
}

