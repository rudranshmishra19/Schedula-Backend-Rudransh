# Schedula - Appointment Scheduling Backend

## Overview

Schedula is a backend design for an appointment scheduling system.

The system allows:
- Patients to book appointments
- Doctors to manage availability and services
- Tracking of appointments, feedback, notifications, and complaints

This repository contains the database design (ER Diagram) for the system.

---

## Core Features

- User authentication (Doctor / Patient roles)
- Doctor profile management
- Patient profile management
- Appointment booking system
- Doctor services (many-to-many relationship)
- Feedback and rating system
- Notifications
- Complaint tracking

---

## Database Design

The system is structured using:

- `users` – Handles authentication and roles
- `doctors` – Stores doctor-specific details
- `patients` – Stores patient-specific details
- `appointments` – Connects doctors and patients
- `services` – Medical services offered
- `doctor_services` – Junction table for doctors and services
- `feedback`, `notifications`, `complaints` – Supporting modules

The ER Diagram is included as:

`ER-Diagram.png`

---

## Author

Rudransh Mishra
