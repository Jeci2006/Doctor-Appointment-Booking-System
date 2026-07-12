import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import bcrypt from 'bcryptjs';

// Setup Admin User Tool
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let admin = await User.findOne({ email });

        if (admin) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({ success: true, message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, phone, fee, availableSlots } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'doctor'
        });

        const doctor = await Doctor.create({
            user: user._id,
            specialization,
            experience,
            phone,
            fee,
            availableSlots: availableSlots || [],
            isApproved: true
        });

        res.status(201).json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('user', '-password');
        res.status(200).json({ success: true, count: doctors.length, doctors });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('user', '-password');
        res.status(200).json({ success: true, count: patients.length, patients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
         const appointments = await Appointment.find()
            .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
            
        res.status(200).json({ success: true, count: appointments.length, appointments });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
};
