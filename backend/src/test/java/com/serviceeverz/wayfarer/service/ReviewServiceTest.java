package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.Review;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ReviewServiceTest {

    @Test
    void createMethodShouldAllowWrites() throws NoSuchMethodException {
        Method method = ReviewService.class.getMethod("create", Review.class);
        Transactional transactional = method.getAnnotation(Transactional.class);

        assertNotNull(transactional, "create should be annotated with @Transactional");
        assertFalse(transactional.readOnly(), "create should not be marked read-only");
    }
}
