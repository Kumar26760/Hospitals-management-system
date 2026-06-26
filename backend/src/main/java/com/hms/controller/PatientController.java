package com.hms.controller;

import com.hms.model.Patient;
import com.hms.repository.PatientRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRepository patientRepository;

    @GetMapping
    public List<Patient> getAll() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Patient create(@Valid @RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Patient updated) {
        return patientRepository.findById(id).map(patient -> {
            patient.setName(updated.getName());
            patient.setAge(updated.getAge());
            patient.setGender(updated.getGender());
            patient.setEmail(updated.getEmail());
            patient.setPhone(updated.getPhone());
            patient.setAddress(updated.getAddress());
            patient.setBloodGroup(updated.getBloodGroup());
            return ResponseEntity.ok(patientRepository.save(patient));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!patientRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        patientRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Patient deleted"));
    }
}
