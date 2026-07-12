import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { addDoctor, getAllDoctors, getAllPatients, getAllAppointments, createAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Allow initialization of first admin (remove in prod)
router.post('/setup', createAdmin);

router.use(protect);
router.use(authorize('admin'));

router.post('/doctor', addDoctor);
router.get('/doctors', getAllDoctors);
router.get('/patients', getAllPatients);
router.get('/appointments', getAllAppointments);

export default router;
