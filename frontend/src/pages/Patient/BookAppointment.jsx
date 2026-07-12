import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Search, MapPin, Star, CalendarDays, LayoutGrid, Heart, Brain, Activity, Stethoscope, Clock, Shield } from 'lucide-react';

const LiverIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C8.6 2 5.5 3.5 3.4 5.9C2.5 6.9 2 8.2 2 9.5C2 12.5 4.5 15 7.5 15C8.8 15 10 14.5 10.9 13.6L12 12.5L13.1 13.6C14 14.5 15.2 15 16.5 15C19.5 15 22 12.5 22 9.5C22 8.2 21.5 6.9 20.6 5.9C18.5 3.5 15.4 2 12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12C8.5 12 9 11.5 9 11C9 10.5 8.5 10 8 10C7.5 10 7 10.5 7 11C7 11.5 7.5 12 8 12Z" fill="white"/>
        <path d="M16 12C16.5 12 17 11.5 17 11C17 10.5 16.5 10 16 10C15.5 10 15 10.5 15 11C15 11.5 15.5 12 16 12Z" fill="white"/>
    </svg>
);

const BoneIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M17 3C15.9 3 15 3.9 15 5C15 5.3 15.1 5.6 15.2 5.9C14.1 6.3 13.2 7.1 12.7 8.2C12.2 7.1 11.3 6.3 10.2 5.9C10.3 5.6 10.4 5.3 10.4 5C10.4 3.9 9.5 3 8.4 3C7.3 3 6.4 3.9 6.4 5C6.4 5.8 6.9 6.5 7.6 6.8C7.1 7.2 6.6 7.7 6.3 8.3C4.9 8.6 3.9 9.8 3.9 11.2V12.8C3.9 14.2 4.9 15.4 6.3 15.7C6.6 16.3 7.1 16.8 7.6 17.2C6.9 17.5 6.4 18.2 6.4 19C6.4 20.1 7.3 21 8.4 21C9.5 21 10.4 20.1 10.4 19C10.4 18.7 10.3 18.4 10.2 18.1C11.3 17.7 12.2 16.9 12.7 15.8C13.2 16.9 14.1 17.7 15.2 18.1C15.1 18.4 15 18.7 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 18.2 18.5 17.5 17.8 17.2C18.3 16.8 18.8 16.3 19.1 15.7C20.5 15.4 21.5 14.2 21.5 12.8V11.2C21.5 9.8 20.5 8.6 19.1 8.3C18.8 7.7 18.3 7.2 17.8 6.8C18.5 6.5 19 5.8 19 5C19 3.9 18.1 3 17 3Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [bookingState, setBookingState] = useState({
        isActive: false, doctor: null, date: '', time: '', symptoms: ''
    });

    const navigate = useNavigate();

    const categories = [
        { id: 'all', name: 'All', icon: LayoutGrid, spec: '', color: 'emerald' },
        { id: 'heart', name: 'Cardiology', icon: Heart, spec: 'Cardiologist', color: 'rose' },
        { id: 'liver', name: 'Gastroenterology', icon: LiverIcon, spec: 'Gastroenterologist', color: 'orange' },
        { id: 'ortho', name: 'Orthopedics', icon: BoneIcon, spec: 'Orthopedic Surgeon', color: 'blue' },
        { id: 'neuro', name: 'Neurology', icon: Brain, spec: 'Neurologist', color: 'purple' },
        { id: 'oncology', name: 'Oncology', icon: Activity, spec: 'Oncologist', color: 'indigo' },
        { id: 'general', name: 'General', icon: Stethoscope, spec: 'General Physician', color: 'teal' },
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
             try {
                 const res = await api.get('/patient/doctors');
                 setDoctors(res.data.doctors);
             } catch (error) {
                 toast.error('Failed to load doctors');
             } finally {
                 setLoading(false);
             }
        };
        fetchDoctors();
    }, []);

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    const filteredDoctors = doctors.filter(doc => {
        const matchesSearch = doc.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              doc.specialization.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpec = selectedSpecialization === '' || doc.specialization === selectedSpecialization;
        return matchesSearch && matchesSpec;
    });

    const proceedToBook = (doctor) => {
        setBookingState({ ...bookingState, isActive: true, doctor });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
             await api.post('/patient/appointments', {
                 doctorId: bookingState.doctor._id,
                 date: bookingState.date,
                 time: bookingState.time,
                 symptoms: bookingState.symptoms
             });
             toast.success('Appointment booked successfully!');
             navigate('/patient/appointments');
        } catch (error) {
             toast.error(error.response?.data?.message || 'Booking failed');
        }
    };

    const getColorClasses = (color, isActive) => {
        const variants = {
            emerald: isActive ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50',
            rose: isActive ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-white text-rose-600 border-rose-100 hover:bg-rose-50',
            orange: isActive ? 'bg-orange-600 text-white shadow-orange-200' : 'bg-white text-orange-600 border-orange-100 hover:bg-orange-50',
            blue: isActive ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50',
            purple: isActive ? 'bg-purple-600 text-white shadow-purple-200' : 'bg-white text-purple-600 border-purple-100 hover:bg-purple-50',
            indigo: isActive ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50',
            teal: isActive ? 'bg-teal-600 text-white shadow-teal-200' : 'bg-white text-teal-600 border-teal-100 hover:bg-teal-50',
        };
        return variants[color];
    };

    return (
        <Layout role="patient">
            {!bookingState.isActive ? (
                <>
                    <div className="mb-8 animate-fade-in text-slate-900">
                        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Book an Appointment</h1>
                        <p className="text-slate-500 font-medium">Find the right specialist for your needs</p>
                    </div>

                    {/* Category Filters */}
                    <div className="mb-10 animate-fade-in delay-100 overflow-x-auto pb-4 scrollbar-hide">
                        <div className="flex items-center gap-4 min-w-max">
                            {categories.map((cat) => {
                                const isActive = selectedSpecialization === cat.spec;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedSpecialization(cat.spec)}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-3xl border transition-all duration-300 min-w-[110px] sm:min-w-[120px] ${getColorClasses(cat.color, isActive)} ${isActive ? 'scale-105 shadow-xl -translate-y-1' : 'shadow-sm'}`}
                                    >
                                        <div className={`p-3 rounded-2xl ${isActive ? 'bg-white/20' : 'bg-slate-50'}`}>
                                            <cat.icon size={28} />
                                        </div>
                                        <span className="text-xs font-bold tracking-wide uppercase">{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in delay-200">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Search doctors by name or specialty..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm bg-white font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <select 
                                className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm bg-white font-medium"
                                value={selectedSpecialization}
                                onChange={(e) => setSelectedSpecialization(e.target.value)}
                            >
                                <option value="">All Specializations</option>
                                {specializations.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Doctor List */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="font-medium">Loading specialist profiles...</p>
                        </div>
                    ) : filteredDoctors.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 animate-fade-in">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                                <Search size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">No Specialists Found</h3>
                            <p className="text-slate-500 mt-2 max-w-sm mx-auto">We couldn't find any doctors matching your current filters. Try adjusting your search.</p>
                            <button 
                                onClick={() => {setSearchQuery(''); setSelectedSpecialization('');}}
                                className="mt-8 text-emerald-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in delay-300">
                            {filteredDoctors.map(doctor => (
                                <div key={doctor._id} className="card group">
                                    <div className="p-8 flex flex-col h-full">
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-3xl font-extrabold border-2 border-emerald-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                {doctor.user?.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-xl text-slate-900 leading-tight">Dr. {doctor.user?.name}</h3>
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Available" />
                                                </div>
                                                <p className="text-emerald-600 font-bold text-sm mb-2">{doctor.specialization}</p>
                                                <div className="flex flex-wrap gap-3">
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                                                        <Star size={14} className="text-amber-400 fill-current" /> 
                                                        {doctor.experience} Yrs Exp
                                                    </span>
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        Main Clinic
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consultation Fee</p>
                                                <p className="text-2xl font-black text-slate-900">${doctor.fee}</p>
                                            </div>
                                            <button 
                                                onClick={() => proceedToBook(doctor)}
                                                className="btn-primary py-2.5 px-6 text-sm"
                                            >
                                                Book Visit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="max-w-2xl mx-auto py-8">
                    <button 
                        onClick={() => setBookingState({ ...bookingState, isActive: false })}
                        className="text-slate-500 hover:text-emerald-600 mb-8 flex items-center gap-2 font-bold transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                            ←
                        </div>
                        Back to Specialist List
                    </button>

                    <div className="card overflow-hidden shadow-2xl">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 text-white flex items-center gap-6 relative overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            
                            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black backdrop-blur-md border border-white/30 shadow-xl">
                                {bookingState.doctor.user?.name.charAt(0)}
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-black tracking-tight">Dr. {bookingState.doctor.user?.name}</h2>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-emerald-100 font-bold px-3 py-1 bg-white/10 rounded-full text-xs uppercase tracking-wider">{bookingState.doctor.specialization}</span>
                                    <span className="text-white/80 font-bold text-sm">${bookingState.doctor.fee} Fee</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleBookingSubmit} className="p-8 space-y-8 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <CalendarDays size={18} className="text-emerald-600" />
                                        Select Date
                                    </label>
                                    <input 
                                        type="date" 
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="input-field"
                                        value={bookingState.date}
                                        onChange={(e) => setBookingState({ ...bookingState, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <Clock size={18} className="text-emerald-600" />
                                        Preferred Time
                                    </label>
                                    <select 
                                        required
                                        className="input-field"
                                        value={bookingState.time}
                                        onChange={(e) => setBookingState({ ...bookingState, time: e.target.value })}
                                    >
                                        <option value="">Choose a slot...</option>
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="09:30 AM">09:30 AM</option>
                                        <option value="10:00 AM">10:00 AM</option>
                                        <option value="10:30 AM">10:30 AM</option>
                                        <option value="11:00 AM">11:00 AM</option>
                                        <option value="11:30 AM">11:30 AM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="02:30 PM">02:30 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="03:30 PM">03:30 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-slate-700">Detailed symptoms or reason for visit</label>
                                <textarea 
                                    required
                                    className="input-field resize-none h-32"
                                    placeholder="Please describe your health concern briefly..."
                                    value={bookingState.symptoms}
                                    onChange={(e) => setBookingState({ ...bookingState, symptoms: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-3xl border border-dotted border-slate-300">
                                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <Shield size={18} className="text-blue-500" />
                                    Doctor's Weekly Availability
                                </h4>
                                {bookingState.doctor.availableSlots?.length > 0 ? (
                                    <ul className="text-sm text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {bookingState.doctor.availableSlots.map((slot, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span className="font-semibold text-slate-700">{slot.day}:</span> {slot.startTime} - {slot.endTime}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">This specialist maintains an open schedule. Feel free to request any preferred time.</p>
                                )}
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <button type="submit" className="btn-primary w-full py-4 text-lg">Confirm Your Appointment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default BookAppointment;
