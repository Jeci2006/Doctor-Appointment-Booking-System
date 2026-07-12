import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getDoctorAppointments, updateAppointmentStatus, updateAvailability, getDoctorProfile, cancelAppointmentByDoctor, reportDelay } from '../controllers/doctorController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('doctor'));

router.get('/profile', getDoctorProfile);
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.put('/appointments/:id/cancel', cancelAppointmentByDoctor);
router.put('/availability', updateAvailability);
router.post('/delay', reportDelay);

export default router;
