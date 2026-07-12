import express from 'express';
import { registerPatient, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/login', login);
router.get('/logout', logout);

export default router;
