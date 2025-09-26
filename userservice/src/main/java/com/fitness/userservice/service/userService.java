package com.fitness.userservice.service;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.RegisterUser;
import com.fitness.userservice.dto.userResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.userRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class   userService {
     @Autowired
     private userRepository userRepository;
     @Autowired
     private keyCloakService keyCloakService;

    public userResponse getUserProfile(String userId) {
        User user=userRepository.findByKeycloakId(userId);
        return getUserResponse(user);
    }

    private userResponse getUserResponse(User user) {
        userResponse userResponse = new userResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setAge(user.getAge());
        userResponse.setKeycloakId(user.getKeycloakId());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedDate(user.getCreatedDate());
        userResponse.setUpdatedDate(user.getUpdatedDate());
        return userResponse;
    }

    public userResponse register(@Valid RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            User existingUser = userRepository.findByEmail(request.getEmail());
            return getUserResponse(existingUser);
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setKeycloakId(request.getKeycloakId());
        User save = userRepository.save(user);
        return getUserResponse(save);
       }

    public Boolean existByUserId(String userId) {
        return userRepository.existsBykeycloakId(userId);
    }

    public userResponse registerUser(RegisterUser request) {
        String keycloakId = keyCloakService.createUser(request);
        if(keycloakId==null){
            throw new RuntimeException("keycloakId is null and user can not be created");
        }
        User user = new User();
        user.setAge(request.getAge());
        user.setFirstName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setLastName(request.getLastName());
        user.setPassword(request.getPassword());
        user.setKeycloakId(keycloakId);
        userRepository.save(user);
        return userresponse(user,keycloakId);
    }

    private userResponse userresponse(User user,String keycloakId) {
        userResponse userResponse = new userResponse();
        userResponse.setId(user.getId());
        userResponse.setEmail(user.getEmail());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedDate(user.getCreatedDate());
        userResponse.setUpdatedDate(user.getUpdatedDate());
        userResponse.setKeycloakId(keycloakId);
        return userResponse;
    }
}
