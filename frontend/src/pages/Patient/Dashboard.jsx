import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Calendar, UserCircle, Search, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/patient/appointments');
                const appointments = res.data.appointments;
                const now = new Date();

                // Filter for upcoming appointments only
                const upcoming = appointments.filter(a => new Date(a.date) >= now && a.status !== 'Rejected')
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3); // Top 3

                setUpcomingAppointments(upcoming);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await api.delete(`/patient/appointments/${id}`);
            toast.success("Appointment cancelled successfully");
            setUpcomingAppointments(prev => prev.filter(appt => appt._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel appointment");
        }
    };

    return (
        <Layout role="patient">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Hello, {user?.name.split(' ')[0]} </h1>
                <p className="text-slate-500">How are you feeling today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl p-6 text-white shadow-lg shadow-primary-500/30 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Need a Doctor?</h2>
                        <p className="text-primary-100 mb-4 max-w-sm">Book an appointment easily with our experienced professionals.</p>
                        <button
                            onClick={() => navigate('/patient/book-appointment')}
                            className="bg-white text-primary-600 px-5 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-2"
                        >
                            <Search size={18} /> Find a Doctor
                        </button>
                    </div>
                    <div className="hidden md:block opacity-80">
                        <UserCircle size={100} />
                    </div>
                </div>

                <div className="card p-6 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-slate-600 mb-2">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Quick Access</p>
                            <h3 className="text-lg font-bold text-slate-800">Your Appointment History</h3>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/patient/appointments')}
                        className="mt-4 w-full py-2 border-2 border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 font-medium transition-colors"
                    >
                        View All History
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-primary-500" /> Upcoming Appointments
                    </h2>
                </div>

                {loading ? (
                    <div className="card p-8 text-center text-slate-500">Loading your schedule...</div>
                ) : upcomingAppointments.length === 0 ? (
                    <div className="card p-8 text-center bg-slate-50/50 border-dashed border-2">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-400">
                            <Calendar size={30} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-700 mb-1">No Upcoming Appointments</h3>
                        <p className="text-slate-500 text-sm mb-4">You have no scheduled visits at the moment.</p>
                        <button
                            onClick={() => navigate('/patient/book-appointment')}
                            className="text-primary-600 font-medium hover:text-primary-700"
                        >
                            Book one now →
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {upcomingAppointments.map((appt) => (
                            <div key={appt._id} className="card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-emerald-500">
                                <div className="flex items-center gap-4">
                                    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-center min-w-[80px]">
                                        <p className="text-xs font-bold uppercase">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}</p>
                                        <p className="text-xl font-black">{new Date(appt.date).getDate()}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">Dr. {appt.doctor?.user?.name}</h3>
                                        <p className="text-slate-600 text-sm flex items-center gap-2 mt-1">
                                            <Clock size={14} className="text-slate-400" /> {appt.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${appt.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {appt.status}
                                    </span>
                                    {appt.status === 'Pending' && (
                                        <button
                                            onClick={() => handleCancel(appt._id)}
                                            className="px-4 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Dashboard;
