import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import { sendEmailNotification, sendWhatsAppMessage } from './notificationService.js';

export const initCronJobs = () => {
    // Run every day at 08:00 AM
    cron.schedule('0 8 * * *', async () => {
        console.log('--- CRON JOB: Running daily appointment reminder check ---');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Calculate dates for 1 day and 2 days from now
            const oneDayFromNow = new Date(today);
            oneDayFromNow.setDate(today.getDate() + 1);

            const twoDaysFromNow = new Date(today);
            twoDaysFromNow.setDate(today.getDate() + 2);

            // Fetch all approved appointments for those days
            const upcomingAppointments = await Appointment.find({
                status: 'Approved',
                date: { 
                    $in: [oneDayFromNow, twoDaysFromNow] 
                }
            }).populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
              .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } });

            if (upcomingAppointments.length === 0) {
                console.log('CRON JOB: No upcoming appointments to send reminders for today.');
                return;
            }

            console.log(`CRON JOB: Found ${upcomingAppointments.length} appointments for reminders.`);

            // Send reminders
            upcomingAppointments.forEach(appt => {
                const patientName = appt.patient.user.name;
                const patientEmail = appt.patient.user.email;
                const patientPhone = appt.patient.phone;
                const doctorName = appt.doctor.user.name;
                const apptDateStr = new Date(appt.date).toLocaleDateString();
                const apptTime = appt.time;

                // Determine if it's 1 day or 2 days away
                const isTomorrow = new Date(appt.date).getTime() === oneDayFromNow.getTime();
                const daysText = isTomorrow ? "Tomorrow" : "in 2 Days";

                // Email content
                const subject = `Appointment Reminder: ${daysText} with Dr. ${doctorName}`;
                const emailMessage = `Dear ${patientName},\n\nThis is a friendly reminder for your upcoming appointment with Dr. ${doctorName}.\n\nDate: ${apptDateStr}\nTime: ${apptTime}\n\nPlease arrive 10 minutes early. If you need to reschedule or cancel, please contact the clinic or manage your appointment online.\n\nThank you!`;
                
                // WhatsApp content
                const whatsappMessage = `*Appointment Reminder*\n\nDear ${patientName},\nYour appointment with Dr. ${doctorName} is coming up ${daysText}!\n\n📅 Date: ${apptDateStr}\n⏰ Time: ${apptTime}\n\nPlease let us know if you cannot make it.\nSee you soon!`;

                sendEmailNotification(patientEmail, subject, emailMessage);
                sendWhatsAppMessage(patientPhone, whatsappMessage);
            });

            console.log('--- CRON JOB: Daily reminders dispatched ---');
        } catch (error) {
            console.error('CRON JOB ERROR:', error);
        }
    });

    console.log('Cron jobs initialized successfully.');
};
