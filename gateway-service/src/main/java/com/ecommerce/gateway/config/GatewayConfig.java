package com.ecommerce.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Product Service Routes (matches ProductController: /products, CategoryController: /categories)
                .route("product-service", r -> r
                        .path("/products/**", "/categories/**")
                        .filters(f -> f.removeRequestHeader("X-Forwarded-Host"))
                        .uri("lb://product-service"))
                
                // Order Service Routes (matches OrderController: /orders, CartController: /cart)
                .route("order-service", r -> r
                        .path("/orders/**", "/cart/**")
                        .filters(f -> f.removeRequestHeader("X-Forwarded-Host"))
                        .uri("lb://order-service"))
                
                // Client API Routes - Authentication (matches AuthController: /auth)
                .route("client-api-auth", r -> r
                        .path("/auth/**")
                        .filters(f -> f.removeRequestHeader("X-Forwarded-Host"))
                        .uri("lb://client-api"))
                
                // Client API Routes - Users (matches UserController: /api/users)
                .route("client-api-users", r -> r
                        .path("/api/users/**")
                        .filters(f -> f.removeRequestHeader("X-Forwarded-Host"))
                        .uri("lb://client-api"))
                
                .build();
    }
}
