package com.grocery.controller;

import com.grocery.model.User;
import com.grocery.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        
        if (userRepository.existsByEmail(user.getEmail())) {
            response.put("message", "Error: Email is already in use!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        userRepository.save(user);
        
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            response.put("message", "Login successful!");
            response.put("userId", user.getId());
            response.put("userName", user.getName());
            response.put("email", user.getEmail());
            response.put("shopName", user.getShopName());
            response.put("shopLicense", user.getShopLicense());
            response.put("phoneNumber", user.getPhoneNumber());
            response.put("shopAddress", user.getShopAddress());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid email or password!");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            response.put("userId", user.getId());
            response.put("userName", user.getName());
            response.put("email", user.getEmail());
            response.put("shopName", user.getShopName());
            response.put("shopLicense", user.getShopLicense());
            response.put("phoneNumber", user.getPhoneNumber());
            response.put("shopAddress", user.getShopAddress());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "User not found!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<Map<String, String>> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        Optional<User> userOpt = userRepository.findById(id);
        Map<String, String> response = new HashMap<>();

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (updates.containsKey("name")) user.setName(updates.get("name"));
            if (updates.containsKey("shopName")) user.setShopName(updates.get("shopName"));
            if (updates.containsKey("shopAddress")) user.setShopAddress(updates.get("shopAddress"));
            if (updates.containsKey("phoneNumber")) user.setPhoneNumber(updates.get("phoneNumber"));
            if (updates.containsKey("shopLicense")) user.setShopLicense(updates.get("shopLicense"));

            userRepository.save(user);
            response.put("message", "Profile updated successfully!");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "User not found!");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
