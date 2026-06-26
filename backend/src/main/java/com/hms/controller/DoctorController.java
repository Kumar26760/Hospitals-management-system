package com.hms.controller;

import com.hms.model.Doctor;
import com.hms.repository.DoctorRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;

    @GetMapping
    public List<Doctor> getAll() {
        return doctorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Doctor create(@Valid @RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Doctor updated) {
        return doctorRepository.findById(id).map(doctor -> {
            doctor.setName(updated.getName());
            doctor.setSpecialization(updated.getSpecialization());
            doctor.setEmail(updated.getEmail());
            doctor.setPhone(updated.getPhone());
            doctor.setDepartment(updated.getDepartment());
            doctor.setAvailable(updated.getAvailable());
            return ResponseEntity.ok(doctorRepository.save(doctor));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctorRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Doctor deleted"));
    }
}
