import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed', 'No Show'],
        default: 'Pending'
    },
    symptoms: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema, 'appointments');
export default Appointment;
