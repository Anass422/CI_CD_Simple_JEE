package com.ecommerce.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthorizationHeaderFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(AuthorizationHeaderFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        logger.info("=== Gateway Filter - Processing request: {} ===", request.getURI());
        
        // Log the Authorization header for debugging
        String authHeader = request.getHeaders().getFirst("Authorization");
        if (authHeader != null) {
            logger.info("Gateway - Authorization header FOUND: {}", authHeader.substring(0, Math.min(30, authHeader.length())) + "...");
        } else {
            logger.warn("Gateway - NO Authorization header found in request!");
        }
        
        // Log all headers for debugging
        logger.debug("All headers: {}", request.getHeaders().keySet());
        
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // High priority to run early
    }
}
