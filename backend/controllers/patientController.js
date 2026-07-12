import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

export const getAvailableDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isApproved: true })
            .populate('user', 'name email role')
            .select('-__v -createdAt -updatedAt');
            
        res.status(200).json({ success: true, count: doctors.length, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, symptoms } = req.body;

        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        // Ensure robust date checking for double booking, ignoring time portion of the date
        const targetDate = new Date(date);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const existingAppointment = await Appointment.findOne({ 
            doctor: doctor._id, 
            date: { $gte: startOfDay, $lte: endOfDay }, 
            time, 
            status: { $in: ['Pending', 'Approved'] } 
        });

        if (existingAppointment) {
             return res.status(400).json({ success: false, message: 'This time slot is already booked for this doctor. Please choose another time.' });
        }

        // Check against doctor's availableSlots
        const appointmentDate = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[appointmentDate.getDay()];

        const isTimeInRange = (time, start, end) => {
            const getMinutes = (t) => {
                if (!t) return 0;
                let [timePart, modifier] = t.split(' ');
                let [hours, minutes] = timePart.split(':').map(Number);
                
                if (modifier) {
                    if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
                    if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
                }
                return hours * 60 + minutes;
            };
            const timeMin = getMinutes(time);
            const startMin = getMinutes(start);
            const endMin = getMinutes(end);
            return timeMin >= startMin && timeMin <= endMin;
        };

        const slotForDay = doctor.availableSlots.find(slot => 
            slot.day === dayName && isTimeInRange(time, slot.startTime, slot.endTime)
        );

        if (!slotForDay) {
            return res.status(400).json({ 
                success: false, 
                message: `Doctor is not available on ${dayName} at ${time}. Please check their available slots.` 
            });
        }

        const appointment = await Appointment.create({
            patient: patient._id,
            doctor: doctor._id,
            date: new Date(date),
            time,
            symptoms,
            status: 'Pending'
        });

        res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPatientAppointments = async (req, res) => {
    try {
        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });

        const appointments = await Appointment.find({ patient: patient._id })
            .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
            .sort({ date: -1, time: -1 });

        res.status(200).json({ success: true, count: appointments.length, appointments });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const patient = await Patient.findOne({ user: req.user._id });
        if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });

        const appointment = await Appointment.findOne({ _id: id, patient: patient._id });
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        if (appointment.status === 'Approved') {
            return res.status(400).json({ success: false, message: 'Cannot cancel an already approved appointment. Please contact the clinic.' });
        }

         await Appointment.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
};

export const getPatientProfile = async (req, res) => {
    try {
        const patient = await Patient.findOne({ user: req.user._id }).populate('user', '-password');
        if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
        
        res.status(200).json({ success: true, patient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
