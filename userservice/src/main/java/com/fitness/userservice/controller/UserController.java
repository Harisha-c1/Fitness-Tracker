package com.fitness.userservice.controller;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.RegisterUser;
import com.fitness.userservice.dto.userResponse;
import com.fitness.userservice.service.userService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserController {

    private final userService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<userResponse> getUserProfile(@PathVariable String userId){
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }
    @PostMapping("/register")
    public ResponseEntity<userResponse> register(@Valid  @RequestBody RegisterRequest request){
        return ResponseEntity.ok(userService.register(request));
    }
    @PostMapping("/registerUser")
    public ResponseEntity<userResponse> register(@Valid  @RequestBody RegisterUser request){
        if(request!=null){
             return ResponseEntity.ok(userService.registerUser(request));}
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId){
        return ResponseEntity.ok(userService.existByUserId(userId));
    }

}
