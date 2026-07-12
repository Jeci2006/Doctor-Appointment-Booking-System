import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import { sendEmailNotification, sendSMSNotification, sendWhatsAppMessage } from '../utils/notificationService.js';

export const getDoctorAppointments = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
            .sort({ date: 1, time: 1 });

        res.status(200).json({ success: true, count: appointments.length, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        const appointment = await Appointment.findOne({ _id: id, doctor: doctor._id })
            .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
            
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        if (!['Approved', 'Rejected', 'Completed', 'No Show'].includes(status)) {
             return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        appointment.status = status;
        if (notes) appointment.notes = notes;
        await appointment.save();

        // Send Notification to Patient
        const patientName = appointment.patient.user.name;
        const patientEmail = appointment.patient.user.email;
        const patientPhone = appointment.patient.phone;
        const doctorName = appointment.doctor.user.name;
        const apptDate = new Date(appointment.date).toLocaleDateString();
        const apptTime = appointment.time;

        let subject = '';
        let message = '';
        
        if (status === 'Completed') {
            subject = `Consultation Report - Dr. ${doctorName}`;
            message = `Dear ${patientName},\n\nYour appointment with Dr. ${doctorName} on ${apptDate} is now complete.\n\nConsultation Report & Notes:\n${notes || 'No specific notes provided.'}\n\nThank you for using our service.`;
        } else if (status === 'No Show') {
            subject = `Appointment Missed - Dr. ${doctorName}`;
            message = `Dear ${patientName},\n\nOur records indicate you missed your scheduled appointment with Dr. ${doctorName} on ${apptDate} at ${apptTime}.\n\nIf you need to reschedule, please contact the clinic or book a new appointment online.`;
        } else {
            subject = `Appointment ${status} - Dr. ${doctorName}`;
            message = `Dear ${patientName},\n\nYour appointment with Dr. ${doctorName} on ${apptDate} at ${apptTime} has been ${status.toLowerCase()}.\n\nNotes from doctor: ${notes || 'No additional notes.'}\n\nThank you for using our service.`;
        }

        // Send asynchronously
        sendEmailNotification(patientEmail, subject, message);
        sendSMSNotification(patientPhone, message);

        res.status(200).json({ success: true, message: `Appointment ${status.toLowerCase()}`, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



export const cancelAppointmentByDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        const appointment = await Appointment.findOne({ _id: id, doctor: doctor._id })
            .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });
            
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        appointment.status = 'Cancelled';
        appointment.notes = reason || 'Doctor is unavailable at the scheduled time.';
        await appointment.save();

        // Send Email Notification
        const patientName = appointment.patient.user.name;
        const patientEmail = appointment.patient.user.email;
        const doctorName = appointment.doctor.user.name;
        const apptDate = new Date(appointment.date).toLocaleDateString();
        const apptTime = appointment.time;

        const emailSubject = `Appointment CANCELLED - Dr. ${doctorName}`;
        const emailMessage = `Dear ${patientName},\n\nWe regret to inform you that your appointment with Dr. ${doctorName} on ${apptDate} at ${apptTime} has been cancelled due to doctor unavailability.\n\nReason: ${appointment.notes}\n\nPlease book another slot or contact the clinic for rescheduling.\n\nWe apologize for the inconvenience.`;
        
        sendEmailNotification(patientEmail, emailSubject, emailMessage);

        // Send WhatsApp Message
        const whatsappMessage = `*Appointment Cancelled*\n\nYour appointment with Dr. ${doctorName} is cancelled due to doctor unavailability.\n\nReason: ${appointment.notes}\n\nPlease check your email for details.`;
        const patientPhone = appointment.patient.phone;
        
        sendWhatsAppMessage(patientPhone, whatsappMessage);

        res.status(200).json({ success: true, message: 'Appointment cancelled and patient notified', appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAvailability = async (req, res) => {
    try {
        const { availableSlots } = req.body;
        
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        doctor.availableSlots = availableSlots;
        await doctor.save();

        res.status(200).json({ success: true, message: 'Availability updated', doctor });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
};

export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', '-password');
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        
        res.status(200).json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const reportDelay = async (req, res) => {
    try {
        const { delayMinutes } = req.body;
        if (!delayMinutes) {
            return res.status(400).json({ success: false, message: 'Delay time is required' });
        }

        const doctor = await Doctor.findOne({ user: req.user._id }).populate('user');
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });

        // Find today's appointments
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        const appointments = await Appointment.find({
            doctor: doctor._id,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['Approved', 'Pending'] }
        }).populate({ path: 'patient', populate: { path: 'user', select: 'name email' } });

        if (appointments.length === 0) {
            return res.status(200).json({ success: true, message: 'No appointments to notify for today', notifiedCount: 0 });
        }

        const doctorName = doctor.user.name;
        
        // Notify all patients asynchronously
        appointments.forEach(appointment => {
            const patientName = appointment.patient.user.name;
            const patientEmail = appointment.patient.user.email;
            const patientPhone = appointment.patient.phone;
            const apptTime = appointment.time;

            const subject = `Delay Notification - Dr. ${doctorName}`;
            const message = `Dear ${patientName},\n\nPlease be informed that Dr. ${doctorName} is running approximately ${delayMinutes} minutes late today.\n\nYour appointment was scheduled for ${apptTime}.\n\nThank you for your patience.`;

            sendEmailNotification(patientEmail, subject, message);
            
            const whatsappMessage = `*Appointment Delay Update*\n\nDear ${patientName},\nDr. ${doctorName} is running ${delayMinutes} mins late today. Your original time was ${apptTime}.\nThanks for your patience.`;
            sendWhatsAppMessage(patientPhone, whatsappMessage);
        });

        res.status(200).json({ 
            success: true, 
            message: `Delay reported. ${appointments.length} patients notified.`,
            notifiedCount: appointments.length
        });
    } catch (error) {
        console.error("Delay Report Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

