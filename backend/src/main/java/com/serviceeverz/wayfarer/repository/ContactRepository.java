package com.serviceeverz.wayfarer.repository;

import com.serviceeverz.wayfarer.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
}
