import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { UserPlus, ArrowLeft } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: ''
  });

  const { registerPatient } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
        return toast.error('Passwords do not match');
    }
    try {
      const res = await registerPatient(formData);
      toast.success('Registration Successful');
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-2xl w-full animate-fade-in">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6 font-semibold group px-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="card p-8 shadow-xl">
        <div className="text-center mb-8">
            <UserPlus className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900">Create Patient Account</h2>
            <p className="text-slate-500 mt-2">Join our clinic to book your appointments easily</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="font-semibold text-slate-700 border-b pb-2">Account Details</h3>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <input type="text" name="name" required className="input-field" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input type="email" name="email" required className="input-field" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input type="password" name="password" required className="input-field" value={formData.password} onChange={handleChange} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                    <input type="password" name="confirmPassword" required className="input-field" value={formData.confirmPassword} onChange={handleChange} />
                </div>
            </div>

            <div className="space-y-4">
                 <h3 className="font-semibold text-slate-700 border-b pb-2">Personal Information</h3>
                 <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                        <input type="number" name="age" required className="input-field" value={formData.age} onChange={handleChange} />
                     </div>
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                        <select name="gender" className="input-field" value={formData.gender} onChange={handleChange}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                     </div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" name="phone" required className="input-field" value={formData.phone} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <textarea name="address" required className="input-field resize-none h-24" value={formData.address} onChange={handleChange}></textarea>
                </div>
            </div>

            <div className="md:col-span-2 mt-4">
                <button type="submit" className="w-full btn-primary py-3 text-lg">
                    Register Account
                </button>
            </div>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
