package com.ecommerce.order.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "mes-config-ms")
@Data
public class OrderConfigProperties {
    
    /**
     * Number of days to look back for recent orders
     * Configured via: mes-config-ms.commandes-last
     */
    private int commandesLast = 10;
}
