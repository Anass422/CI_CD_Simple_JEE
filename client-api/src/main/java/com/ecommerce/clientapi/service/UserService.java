package com.ecommerce.clientapi.service;

import com.ecommerce.clientapi.entity.User;
import com.ecommerce.clientapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public User registerUser(User user) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false); // Disabled until email verification

        // Generate 6-digit verification code
        String code = generateVerificationCode();
        user.setVerificationCode(code);
        user.setCodeExpiryDate(LocalDateTime.now().plusMinutes(5));

        User savedUser = userRepository.save(user);

        // Send verification email with code
        emailService.sendVerificationCode(savedUser.getEmail(), code);

        return savedUser;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    public boolean verifyEmailWithCode(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify code
        if (!code.equals(user.getVerificationCode())) {
            throw new RuntimeException("Invalid verification code");
        }

        // Check expiration
        if (LocalDateTime.now().isAfter(user.getCodeExpiryDate())) {
            throw new RuntimeException("Verification code has expired");
        }

        // Enable user
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setCodeExpiryDate(null);
        userRepository.save(user);

        return true;
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
