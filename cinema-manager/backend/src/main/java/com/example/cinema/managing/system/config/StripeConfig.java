package com.example.cinema.managing.system.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    private static final Logger logger = LoggerFactory.getLogger(StripeConfig.class);

    @Value("${stripe.api.key:}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        if (stripeSecretKey != null && !stripeSecretKey.isEmpty()
                && !stripeSecretKey.startsWith("placeholder")
                && !stripeSecretKey.startsWith("sk_test_placeholder")) {
            Stripe.apiKey = stripeSecretKey;
            logger.info("Stripe API initialized successfully");
        } else {
            logger.warn("Stripe API key not configured or using placeholder. Payment features will be disabled.");
        }
    }
}
