package com.ecommerce.clientapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.url}")
    private String appUrl;

    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Code de vérification - E-Commerce");
        message.setText(
            "Bonjour,\n\n" +
            "Votre code de vérification est : " + code + "\n\n" +
            "Ce code expire dans 5 minutes.\n\n" +
            "Cordialement,\n" +
            "L'équipe E-Commerce"
        );
        mailSender.send(message);
    }
}
