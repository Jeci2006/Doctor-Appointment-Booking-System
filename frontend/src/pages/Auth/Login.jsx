import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Shield, UserPlus, HeartPulse, Stethoscope, ArrowLeft } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password, role);
      toast.success('Login Successful');
      navigate(`/${res.user.role}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full animate-fade-in">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6 font-semibold group px-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="card p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-4 ring-8 ring-emerald-50/50">
            <HeartPulse className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ClinicCare</h2>
          <p className="text-slate-500 mt-2 font-medium">Your Health, Our Priority</p>
        </div>

        {/* Role Selection */}
        <div className="flex justify-center space-x-2 mb-8 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setRole('patient')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              role === 'patient' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Patient
          </button>
          <button
            onClick={() => setRole('doctor')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              role === 'doctor' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor
          </button>
          <button
             onClick={() => setRole('admin')}
             className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
               role === 'admin' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'
             }`}
          >
             <Shield className="w-4 h-4" /> Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" />
              <label className="ml-2 block text-sm text-slate-700">Remember me</label>
            </div>
            <a href="#" className="font-medium text-sm text-primary-600 hover:text-primary-500">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="w-full btn-primary flex justify-center py-3 text-lg">
            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>

        {role === 'patient' && (
          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register here
            </Link>
          </p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Login;
