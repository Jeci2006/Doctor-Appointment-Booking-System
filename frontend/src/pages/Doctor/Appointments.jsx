import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Check, X, Search, PhoneOff, ClipboardCheck, UserMinus, Calendar as CalendarIcon, List } from 'lucide-react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionNotes, setActionNotes] = useState('');
    const [activeModalId, setActiveModalId] = useState(null);
    const [actionType, setActionType] = useState('Approved'); // 'Approved' or 'Rejected'
    const [viewMode, setViewMode] = useState('list');

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/doctor/appointments');
            setAppointments(res.data.appointments);
        } catch (error) {
            toast.error('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleAction = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/doctor/appointments/${activeModalId}/status`, {
                status: actionType,
                notes: actionNotes
            });
            toast.success(`Appointment ${actionType.toLowerCase()}`);
            setActiveModalId(null);
            setActionNotes('');
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this appointment due to unavailability? The patient will be notified via email and WhatsApp.')) {
            return;
        }

        try {
            await api.put(`/doctor/appointments/${id}/cancel`, {
                reason: 'Doctor is unavailable at the scheduled time.'
            });
            toast.success('Appointment cancelled and patient notified');
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment');
        }
    };

    const handleNoShow = async (id) => {
        if (!window.confirm('Mark this patient as No Show?')) return;
        try {
            await api.put(`/doctor/appointments/${id}/status`, {
                status: 'No Show',
                notes: 'Patient did not attend.'
            });
            toast.success('Patient marked as No Show');
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const openModal = (id, type) => {
        setActiveModalId(id);
        setActionType(type);
    };

    const parseAppointmentTime = (dateStr, timeStr) => {
        const date = new Date(dateStr);
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const processedEvents = appointments.filter(a => a.status === 'Approved' || a.status === 'Pending').map(appt => {
        const start = parseAppointmentTime(appt.date, appt.time);
        const end = new Date(start.getTime() + 30 * 60000); // 30 mins
        return {
            id: appt._id,
            title: `${appt.patient?.user?.name} - ${appt.status}`,
            start,
            end,
            resource: appt
        };
    });

    return (
        <Layout role="doctor">
            <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Appointments</h1>
                    <p className="text-slate-500">Review and respond to patient booking requests.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`p-2 px-4 rounded-md flex items-center gap-2 font-medium text-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                        <List size={16}/> List
                    </button>
                    <button onClick={() => setViewMode('calendar')} className={`p-2 px-4 rounded-md flex items-center gap-2 font-medium text-sm transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                        <CalendarIcon size={16}/> Calendar
                    </button>
                </div>
            </div>

            {viewMode === 'list' ? (
                <div className="card">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-semibold text-sm text-slate-600">Patient</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Date & Time</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Symptoms/Notes</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="p-4 text-center text-slate-500">Loading...</td></tr>
                            ) : appointments.length === 0 ? (
                                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No appointments found</td></tr>
                            ) : (
                                appointments.map((appt) => (
                                    <tr key={appt._id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="p-4">
                                            <p className="font-medium text-slate-800">{appt.patient?.user?.name}</p>
                                            <p className="text-xs text-slate-500">{appt.patient?.user?.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-slate-800 font-medium">{new Date(appt.date).toLocaleDateString()}</p>
                                            <span className="inline-block mt-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">{appt.time}</span>
                                        </td>
                                        <td className="p-4 max-w-xs text-sm text-slate-600 truncate" title={appt.symptoms}>
                                            {appt.symptoms}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                appt.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                                appt.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                appt.status === 'Cancelled' ? 'bg-orange-100 text-orange-700' :
                                                appt.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                appt.status === 'No Show' ? 'bg-slate-200 text-slate-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {appt.status === 'Pending' || appt.status === 'Approved' ? (
                                                <div className="flex gap-2">
                                                    {appt.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => openModal(appt._id, 'Approved')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve">
                                                                <Check size={18} />
                                                            </button>
                                                            <button onClick={() => openModal(appt._id, 'Rejected')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                                                                <X size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {appt.status === 'Approved' && (
                                                        <>
                                                            <button onClick={() => openModal(appt._id, 'Completed')} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Mark Completed & Write Report">
                                                                <ClipboardCheck size={18} />
                                                            </button>
                                                            <button onClick={() => handleNoShow(appt._id)} className="p-2 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Mark No Show">
                                                                <UserMinus size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button onClick={() => handleCancel(appt._id)} className="p-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" title="Cancel (Unavailable)">
                                                        <PhoneOff size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm">Resolved</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            ) : (
                <div className="card h-[650px] p-4 bg-white relative z-0">
                     <Calendar
                        localizer={localizer}
                        events={processedEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        views={['month', 'week', 'day']}
                        defaultView="week"
                        popup
                        onSelectEvent={(event) => {
                            const appt = event.resource;
                            if (appt.status === 'Pending') {
                                openModal(appt._id, 'Approved');
                            }
                        }}
                        eventPropGetter={(event) => {
                            const isPending = event.title.includes('Pending');
                            return {
                                className: isPending ? 'bg-yellow-500 border-none rounded-md' : 'bg-emerald-500 border-none rounded-md'
                            };
                        }}
                     />
                </div>
            )}

            {/* Action Modal */}
            {activeModalId && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h2 className={`text-xl font-bold mb-4 ${actionType === 'Approved' ? 'text-emerald-600' : actionType === 'Completed' ? 'text-blue-600' : 'text-red-600'}`}>
                            {actionType === 'Approved' ? 'Approve Appointment' : actionType === 'Completed' ? 'Complete Consultation' : 'Reject Appointment'}
                        </h2>
                        <form onSubmit={handleAction} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    {actionType === 'Completed' ? 'Consultation Report / Prescriptions' : 'Add Notes (Optional)'}
                                </label>
                                <textarea 
                                    className="input-field resize-none h-24" 
                                    placeholder={actionType === 'Completed' ? 'Write the final report for the patient...' : 'Instructions for the patient...'}
                                    value={actionNotes}
                                    onChange={(e) => setActionNotes(e.target.value)}
                                    required={actionType === 'Completed'}
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setActiveModalId(null)} className="btn-secondary">Cancel</button>
                                <button type="submit" className={`px-4 py-2 rounded-lg text-white font-medium ${actionType === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : actionType === 'Completed' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-500 hover:bg-red-600'}`}>
                                    Confirm {actionType}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Appointments;
