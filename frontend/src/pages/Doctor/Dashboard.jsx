import { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { CalendarCheck, Users, Clock, AlertCircle, X } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ upcoming: 0, pending: 0, totalPatients: 0 });
    const [loading, setLoading] = useState(true);
    const [showDelayModal, setShowDelayModal] = useState(false);
    const [delayMinutes, setDelayMinutes] = useState(15);
    const [isReporting, setIsReporting] = useState(false);

    const handleReportDelay = async () => {
        try {
            setIsReporting(true);
            const res = await api.post('/doctor/delay', { delayMinutes });
            alert(res.data.message);
            setShowDelayModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error reporting delay');
        } finally {
            setIsReporting(false);
        }
    };

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const res = await api.get('/doctor/appointments');
                const allAppts = res.data.appointments;

                const pending = allAppts.filter(a => a.status === 'Pending').length;
                const upcoming = allAppts.filter(a => a.status === 'Approved' && new Date(a.date) >= new Date()).length;
                const uniquePatients = new Set(allAppts.map(a => a.patient._id)).size;

                setStats({ upcoming, pending, totalPatients: uniquePatients });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorData();
    }, []);

    return (
        <Layout role="doctor">
            <div className="mb-8 flex justify-between items-center group">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome, Dr. {user?.name.split(' ')[0]}</h1>
                    <p className="text-slate-500">Here is your daily overview</p>
                </div>
                <button 
                    onClick={() => setShowDelayModal(true)}
                    className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-all duration-300 transform group-hover:scale-105"
                >
                    <AlertCircle size={20} />
                    Report Delay
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading your dashboard...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Inline Style for Entrance Animation */}
                    <style>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-card {
      animation: fadeInUp 0.5s ease forwards;
      opacity: 0;
    }
    .delay-1 { animation-delay: 0.1s; }
    .delay-2 { animation-delay: 0.2s; }
    .delay-3 { animation-delay: 0.3s; }
  `}</style>

                    {/* Card 1: Upcoming Appointments */}
                    <div className="animate-card delay-1 card p-6 flex items-center gap-4 border-l-4 border-emerald-500 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <CalendarCheck size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Upcoming Appointments</p>
                            <p className="text-3xl font-bold text-slate-800">{stats.upcoming}</p>
                        </div>
                    </div>

                    {/* Card 2: Pending Requests */}
                    <div className="animate-card delay-2 card p-6 flex items-center gap-4 border-l-4 border-yellow-500 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                            <Clock size={24} className="animate-pulse" /> {/* Added a subtle pulse to the clock */}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Pending Requests</p>
                            <p className="text-3xl font-bold text-slate-800">{stats.pending}</p>
                        </div>
                    </div>

                    {/* Card 3: Total Patients */}
                    <div className="animate-card delay-3 card p-6 flex items-center gap-4 border-l-4 border-blue-500 bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Patients Seen</p>
                            <p className="text-3xl font-bold text-slate-800">{stats.totalPatients}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Delay Modal */}
            {showDelayModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-card overflow-hidden relative">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <AlertCircle className="text-rose-500" /> Report Delay
                            </h2>
                            <button onClick={() => setShowDelayModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Delay Duration</label>
                            <select 
                                value={delayMinutes} 
                                onChange={(e) => setDelayMinutes(Number(e.target.value))}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium text-slate-700 bg-slate-50"
                            >
                                <option value={15}>15 Minutes</option>
                                <option value={30}>30 Minutes</option>
                                <option value={45}>45 Minutes</option>
                                <option value={60}>1 Hour</option>
                                <option value={90}>1.5 Hours</option>
                                <option value={120}>2 Hours</option>
                            </select>
                            <p className="text-sm text-slate-500 mt-4 bg-rose-50/50 p-3 rounded-lg border border-rose-100 flex gap-2 items-start">
                                <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                                <span>This will immediately send an email and WhatsApp notification to all your patients scheduled for today.</span>
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                onClick={() => setShowDelayModal(false)}
                                className="px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleReportDelay}
                                disabled={isReporting}
                                className="px-5 py-2.5 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {isReporting ? 'Notifying...' : 'Notify Patients'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
