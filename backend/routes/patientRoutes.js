import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getAvailableDoctors, bookAppointment, getPatientAppointments, cancelAppointment, getPatientProfile } from '../controllers/patientController.js';

const router = express.Router();

router.use(protect);
router.use(authorize('patient'));

router.get('/profile', getPatientProfile);
router.get('/doctors', getAvailableDoctors);
router.post('/appointments', bookAppointment);
router.get('/appointments', getPatientAppointments);
router.delete('/appointments/:id', cancelAppointment);

export default router;
