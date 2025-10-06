package com.blooddonation.hub.repository;

import com.blooddonation.hub.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends JpaRepository<BloodRequest, Long> {
}