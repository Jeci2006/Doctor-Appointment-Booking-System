import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const Availability = () => {
    const defaultSlot = { day: 'Monday', startTime: '09:00', endTime: '17:00' };
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/doctor/profile');
                setSlots(res.data.doctor.availableSlots || []);
            } catch (error) {
                toast.error('Failed to load availability profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const addSlot = () => {
        setSlots([...slots, { ...defaultSlot }]);
    };

    const removeSlot = (index) => {
        const newSlots = [...slots];
        newSlots.splice(index, 1);
        setSlots(newSlots);
    };

    const handleChange = (index, field, value) => {
        const newSlots = [...slots];
        newSlots[index][field] = value;
        setSlots(newSlots);
    };

    const handleSave = async () => {
        try {
            await api.put('/doctor/availability', { availableSlots: slots });
            toast.success('Availability updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update availability');
        }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <Layout role="doctor">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Availability</h1>
                    <p className="text-slate-500">Set the times you are available for bookings</p>
                </div>
                <button onClick={handleSave} className="btn-primary">Save Changes</button>
            </div>

            <div className="card p-6 max-w-3xl">
                {loading ? (
                    <div className="text-center py-4">Loading availability...</div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-lg font-semibold text-slate-700">Weekly Schedule</h2>
                            <button onClick={addSlot} className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm">
                                <Plus size={16} /> Add Time Slot
                            </button>
                        </div>

                        {slots.length === 0 ? (
                            <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                You haven't added any available slots yet.
                            </div>
                        ) : (
                            slots.map((slot, index) => (
                                <div key={index} className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Day</label>
                                        <select 
                                            className="input-field py-1.5" 
                                            value={slot.day} 
                                            onChange={(e) => handleChange(index, 'day', e.target.value)}
                                        >
                                            {daysOfWeek.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
                                        <input 
                                            type="time" 
                                            className="input-field py-1.5"
                                            value={slot.startTime}
                                            onChange={(e) => handleChange(index, 'startTime', e.target.value)} 
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
                                        <input 
                                            type="time" 
                                            className="input-field py-1.5"
                                            value={slot.endTime}
                                            onChange={(e) => handleChange(index, 'endTime', e.target.value)} 
                                        />
                                    </div>
                                    <div className="pt-5">
                                        <button 
                                            onClick={() => removeSlot(index)} 
                                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Remove Slot"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Availability;
