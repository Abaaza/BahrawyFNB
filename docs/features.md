# Feature List

This document outlines the planned functionality for the portal.

## User Authentication & Roles

- Secure signup/login with email and password
- Role-based access (`dentist`, `specialist`, `admin`)

## Dentist Dashboard

- Overview of submitted cases with status and type
- Quick access to reports and booking links

## Case Submission & Storage

- Form to submit ClinCheck ID, intraoral photos and simulation links
- Data persisted in the database and file storage

## Case List & Filtering

- Sort or filter by status (e.g. _Pending Review_, _Reviewed_)
- Search by ID or date

## Case Detail & PDF Access

- Display photos and ClinCheck link
- Show review status and allow PDF download with version history

## Specialist Assignment & Intake Queue

- Backend logic to assign new cases to specialists
- Simple UI for specialists to pull from the queue of unassigned cases

## Review Interface with Dropdown Libraries

- Specialists select pre-approved statements from dropdowns
- Include a free-text area for notes

## Real-Time Report Preview

- Live preview pane updates as the specialist edits the report

## PDF Generation & Storage

- One-click export to PDF (e.g. using `jsPDF` or server-side tools)
- Upload final PDF to storage such as S3 or Supabase

## Booking System / Fine-Tuning Calls

- Calendar widget shows specialist availability
- Dentists pick a slot; backend stores booking, sends emails and meeting links

## Notifications & Emails

- Automated emails for verification, PDF readiness and booking reminders
- Optional in-app notifications

## Clinical Library Management (Admin UI)

- Admin interface to manage pre-approved clinical statements

## Specialist Availability Management

- Specialists define working hours and vacation days
- Backend enforces these slots when booking

## User Profile & Settings

- Users can update contact info and change passwords
- Optional notification preference toggles

## Admin Panel & Role Management

- Admin screens to manage users and oversee bookings and reviews

## Data Models & APIs

- Schemas for `User`, `Case`, `Review`, `Booking` and `ClinicalStatement`
- RESTful endpoints for the frontend to perform CRUD operations
