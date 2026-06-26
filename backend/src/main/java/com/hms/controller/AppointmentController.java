package com.hms.controller;

import com.hms.model.Appointment;
import com.hms.model.Doctor;
import com.hms.model.Patient;
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    // Accepts both "2024-01-15T10:30" (datetime-local) and "2024-01-15T10:30:00"
    private static final DateTimeFormatter FLEXIBLE_FORMATTER = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm")
            .optionalStart()
            .appendPattern(":ss")
            .optionalEnd()
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter();

    @GetMapping
    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return appointmentRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public record AppointmentRequest(Long patientId, Long doctorId, String appointmentDateTime, String reason) {}

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AppointmentRequest req) {
        Patient patient = patientRepository.findById(req.patientId()).orElse(null);
        Doctor doctor = doctorRepository.findById(req.doctorId()).orElse(null);

        if (patient == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Patient not found"));
        }
        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Doctor not found"));
        }

        LocalDateTime dateTime;
        try {
            dateTime = LocalDateTime.parse(req.appointmentDateTime(), FLEXIBLE_FORMATTER);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid date format. Use yyyy-MM-ddTHH:mm"));
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDateTime(dateTime);
        appointment.setReason(req.reason());

        return ResponseEntity.ok(appointmentRepository.save(appointment));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
        }
        try {
            Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(statusStr);
            return appointmentRepository.findById(id).map(appointment -> {
                appointment.setStatus(status);
                return ResponseEntity.ok(appointmentRepository.save(appointment));
            }).orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        appointmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Appointment deleted"));
    }
}
