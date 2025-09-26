package com.fitness.userservice.exception;

import com.fitness.userservice.dto.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalexceptionHandler {

        @ExceptionHandler(UserAlreadyExist.class)
        public ResponseEntity<ApiError> handleUserAlreadyExists(UserAlreadyExist ex) {
            ApiError error = new ApiError(
                    HttpStatus.CONFLICT.value(),
                    "USERNAME OR EMAIL ALREADY TAKEN",
                    ex.getMessage()
            );
            return new ResponseEntity<>(error, HttpStatus.CONFLICT);
        }

        @ExceptionHandler(RuntimeException.class) // fallback for all other errors
        public ResponseEntity<ApiError> handleGeneral(RuntimeException ex) {
            ApiError error = new ApiError(
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Something went wrong, please try again later",
                    ex.getMessage()
            );
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }








}
