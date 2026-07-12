# Doctor Appointment Booking System

A full-stack **Doctor Appointment Booking System** developed using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**. The system provides a secure and efficient platform for managing doctor appointments through role-based access for **Admin**, **Doctor**, and **Patient**.

## Project Overview

The Doctor Appointment Booking System simplifies the appointment scheduling process by allowing patients to book appointments with doctors based on their availability. The system also enables doctors to manage appointment requests and update their consultation schedules, while administrators manage both doctors and patients.

The application uses **JWT Authentication** for secure login, **MongoDB** for data storage, and **Nodemailer** for sending appointment-related email notifications.

## Features

### Patient Module
- Patient registration and secure login.
- Search and view available doctors.
- Book appointments based on the doctor's available schedule.
- View appointment history and current appointment status.
- Receive email notifications when:
  - Appointment is approved.
  - Appointment is rejected.
  - Doctor updates appointment time or availability.

### Doctor Module
- Secure doctor login.
- View all appointment requests.
- Approve or reject patient appointments.
- Update consultation availability and working schedule.
- Automatically notify patients through email when appointment schedules are updated.

### Admin Module
- Secure administrator login.
- Add and manage doctor accounts.
- Manage patient accounts.
- Monitor appointments and overall system activities.


## Authentication & Security

- JWT (JSON Web Token) Authentication
- Password Encryption using bcrypt.js
- Role-Based Access Control (Admin, Doctor, Patient)
- Protected Routes
- Secure REST API Architecture

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

### Additional Tools
- Nodemailer (Email Notifications)
- Git & GitHub

## Installation

### Clone the Repository

```bash
git clone https://github.com/Jeci2006/Doctor-Appointment-Booking-System.git
```

### Backend Setup

```bash
cd backend
npm install
npm start
```
### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

##  Environment Variables

Create a `.env` file inside the **backend** folder.

Example:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```
## Workflow

1. Patient registers and logs into the system.
2. Patient searches for available doctors.
3. Patient books an appointment based on doctor availability.
4. Doctor receives the appointment request.
5. Doctor approves or rejects the appointment.
6. Patient receives an email notification about the appointment status.
7. If the doctor changes the appointment schedule or availability, the patient receives an updated email notification.
8. Administrator manages doctors, patients, and overall system operations.

## Email Notification Features

The system automatically sends email notifications for:

- Appointment Approval
- Appointment Rejection
- Schedule Updates
- Availability Changes

## Future Enhancements

- Online Payment Integration
- Video Consultation
- SMS Notifications
- Medical Record Management
- Prescription Upload
- Appointment Reminder Notifications
- Doctor Ratings and Reviews

