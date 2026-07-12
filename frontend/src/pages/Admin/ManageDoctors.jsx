import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialization: '', experience: '', phone: '', fee: ''
  });

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data.doctors);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/doctor', formData);
      toast.success('Doctor added successfully');
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', specialization: '', experience: '', phone: '', fee: '' });
      fetchDoctors();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    }
  };

  return (
    <Layout role="admin">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Doctors</h1>
          <p className="text-slate-500">View and add new doctors to the system</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
           <Plus size={20} /> Add Doctor
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-sm text-slate-600">Name</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Specialization</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Experience</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Fee</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Registered On</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No doctors found</td></tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{doc.user?.name}</p>
                      <p className="text-xs text-slate-500">{doc.user?.email}</p>
                    </td>
                    <td className="p-4 text-slate-700">{doc.specialization}</td>
                    <td className="p-4 text-slate-700">{doc.experience} Years</td>
                    <td className="p-4 text-slate-700">${doc.fee}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Add New Doctor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" name="name" required className="input-field" value={formData.name} onChange={handleChange} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <input type="password" name="password" required className="input-field" value={formData.password} onChange={handleChange} />
                   </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                      <input type="text" name="specialization" required className="input-field" placeholder="e.g. Cardiologist" value={formData.specialization} onChange={handleChange} />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Experience (Years)</label>
                      <input type="number" name="experience" required className="input-field" value={formData.experience} onChange={handleChange} />
                   </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Fee ($)</label>
                      <input type="number" name="fee" required className="input-field" value={formData.fee} onChange={handleChange} />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input type="text" name="phone" required className="input-field" value={formData.phone} onChange={handleChange} />
                   </div>
               </div>
               
               <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Save Doctor</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageDoctors;
