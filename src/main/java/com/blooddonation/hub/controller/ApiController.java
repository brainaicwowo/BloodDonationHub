package com.blooddonation.hub.controller;

import com.blooddonation.hub.model.BloodRequest;
import com.blooddonation.hub.model.Donor;
import com.blooddonation.hub.repository.DonorRepository;
import com.blooddonation.hub.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api") // Base path for all methods in this controller
public class ApiController {

    @Autowired // Automatically injects an instance of DonorRepository
    private DonorRepository donorRepository;

    @Autowired // Automatically injects an instance of RequestRepository
    private RequestRepository requestRepository;

    // --- Donor Endpoints ---

    @PostMapping("/donors") // Handles POST requests to /api/donors
    public Donor addDonor(@RequestBody Donor donor) {
        return donorRepository.save(donor);
    }

    @GetMapping("/donors") // Handles GET requests to /api/donors
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    // --- Request Endpoints ---

    @PostMapping("/requests") // Handles POST requests to /api/requests
    public BloodRequest addRequest(@RequestBody BloodRequest request) {
        return requestRepository.save(request);
    }

    @GetMapping("/requests") // Handles GET requests to /api/requests
    public List<BloodRequest> getAllRequests() {
        return requestRepository.findAll();
    }
}