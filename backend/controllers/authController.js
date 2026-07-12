import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });
};

export const registerPatient = async (req, res) => {
    try {
        const { name, email, password, age, gender, phone, address } = req.body;
        
        // Check user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'patient'
        });

        // Create Patient Profile
        const patient = await Patient.create({
            user: user._id,
            age,
            gender,
            phone,
            address
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                patientId: patient._id
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        let { email, password, role } = req.body;
        
        // Normalize inputs
        if (email) email = email.trim().toLowerCase();
        if (role) role = role.trim().toLowerCase();

        // Find user by email and role
        const user = await User.findOne({ email, role });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials or role mismatch' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'User logged out' });
};
