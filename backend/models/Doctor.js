import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    availableSlots: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        startTime: {
             type: String, 
             required: true 
        },
        endTime: {
             type: String, 
             required: true 
        }
    }],
    isApproved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema, 'doctors');
export default Doctor;
