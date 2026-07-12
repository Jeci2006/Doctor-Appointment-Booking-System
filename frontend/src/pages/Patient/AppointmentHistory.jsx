import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Calendar, Clock, Download } from 'lucide-react';
import jsPDF from 'jspdf';

const AppointmentHistory = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
             try {
                 const res = await api.get('/patient/appointments');
                 setAppointments(res.data.appointments);
             } catch (error) {
                 toast.error('Failed to load appointments');
             } finally {
                 setLoading(false);
             }
        };
        fetchAppointments();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await api.delete(`/patient/appointments/${id}`);
            toast.success("Appointment cancelled successfully");
            setAppointments(prev => prev.filter(appt => appt._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel appointment");
        }
    };

    const downloadReport = (appt) => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Consultation Report", 105, 25, null, null, "center");
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Doctor: Dr. ${appt.doctor?.user?.name}`, 20, 45);
        doc.text(`Date: ${new Date(appt.date).toLocaleDateString()}`, 20, 55);
        doc.text(`Time: ${appt.time}`, 20, 65);
        
        doc.setFont("helvetica", "bold");
        doc.text("Symptoms & Reason:", 20, 85);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(appt.symptoms || "N/A", 20, 95, { maxWidth: 170 });
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Doctor's Notes & Prescriptions:", 20, 115);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const splitNotes = doc.splitTextToSize(appt.notes || "No additional notes provided.", 170);
        doc.text(splitNotes, 20, 125);
        
        doc.save(`Consultation_Report_${new Date(appt.date).toISOString().split('T')[0]}.pdf`);
    };

    const activeAppts = appointments.filter(a => ['Pending', 'Approved'].includes(a.status));
    const pastAppts = appointments.filter(a => !['Pending', 'Approved'].includes(a.status));

    const renderTable = (data, title) => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">{title}</h2>
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-semibold text-sm text-slate-600">Doctor</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Date & Time</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Symptoms/Reason</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-sm text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="p-4 text-center text-slate-500">Loading history...</td></tr>
                            ) : data.length === 0 ? (
                                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No appointments found in this category</td></tr>
                            ) : (
                                data.map((appt) => (
                                    <tr key={appt._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-slate-800">Dr. {appt.doctor?.user?.name}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-800 font-medium whitespace-nowrap">
                                                <Calendar size={14} className="text-slate-400" /> {new Date(appt.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                                                <Clock size={12} /> {appt.time}
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <p className="text-sm text-slate-600 truncate" title={appt.symptoms}>
                                                {appt.symptoms}
                                            </p>
                                            {appt.notes && (
                                                <p className="text-xs text-primary-600 mt-1 truncate" title={appt.notes}>
                                                    <span className="font-medium">Note:</span> {appt.notes}
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                                appt.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                appt.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                appt.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                appt.status === 'No Show' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                                {appt.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {appt.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleCancel(appt._id)}
                                                    className="px-3 py-1 border border-red-200 text-red-600 hover:bg-red-50 rounded-md text-xs font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            {appt.status === 'Completed' && (
                                                <button 
                                                    onClick={() => downloadReport(appt)}
                                                    className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
                                                >
                                                    <Download size={14} /> Report
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <Layout role="patient">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Appointment History</h1>
                <p className="text-slate-500">Track and manage your past and upcoming consultations</p>
            </div>

            {renderTable(activeAppts, "Active & Upcoming")}
            {renderTable(pastAppts, "Past Consultations & Reports")}
        </Layout>
    );
};

export default AppointmentHistory;
