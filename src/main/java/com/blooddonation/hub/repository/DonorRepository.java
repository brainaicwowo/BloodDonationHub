package com.blooddonation.hub.repository;

import com.blooddonation.hub.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    // Spring Data JPA provides all the basic CRUD operations automatically.
}