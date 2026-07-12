package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.entity.Contact;
import com.serviceeverz.wayfarer.exception.ResourceNotFoundException;
import com.serviceeverz.wayfarer.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional(readOnly = true)
    public List<Contact> getAll() {
        return contactRepository.findAll();
    }

    public Contact create(Contact contact) {
        contact.setId(null);
        contact.setDate(LocalDate.now());
        contact.setRead(false);
        return contactRepository.save(contact);
    }

    public Contact markRead(Long id) {
        Contact existing = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        existing.setRead(true);
        return contactRepository.save(existing);
    }

    public void delete(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
}
