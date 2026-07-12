import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Stethoscope,
  ArrowRight, 
  Calendar, 
  Shield, 
  ShieldCheck,
  Clock, 
  Activity, 
  Users, 
  CheckCircle2, 
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Trusted by 10,000+ Patients</span>
              </div>
              
              <h1 className="heading-xl mb-6 leading-[1.1]">
                Your Health Journey <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Simplified.</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Experience healthcare that revolves around you. Connect with top-rated specialists, book instant appointments, and manage your health records all in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/register" className="btn-primary w-full sm:w-auto text-lg group">
                  Book Appointment <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link to="/about" className="btn-secondary w-full sm:w-auto text-lg">
                  Learn How it Works
                </Link>
              </div>

              <div className="mt-12 flex items-center gap-6 divide-x divide-slate-200">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                    4.9+
                  </div>
                </div>
                <div className="pl-6">
                  <div className="flex text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Over 500+ Verified Reviews</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in-right delay-200">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="/images/hero-doctor.png" 
                  alt="Professional Healthcare" 
                  className="w-full h-auto"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 border border-slate-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Verified Doctors</h4>
                    <p className="text-xs text-slate-500">100% Background Checked</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/4 -right-8 bg-white p-4 rounded-2xl shadow-xl z-20 border border-slate-100 animate-float delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Instant Booking</h4>
                    <p className="text-xs text-slate-500">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Specialists', value: '50+', icon: <Stethoscope size={24} className="text-emerald-600" /> },
              { label: 'Happy Patients', value: '10k+', icon: <Users size={24} className="text-blue-600" /> },
              { label: 'Years Experience', value: '15+', icon: <Shield size={24} className="text-purple-600" /> },
              { label: 'Success Rate', value: '98%', icon: <Activity size={24} className="text-rose-600" /> },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Comprehensive Services</h2>
            <p className="text-lg text-slate-600">We provide a wide range of medical services to ensure your health is managed with the highest level of care and expertise.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="card group">
              <div className="h-64 overflow-hidden relative">
                <img src="/images/consultation.png" alt="Telemedicine" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white">Telemedicine</h3>
              </div>
              <div className="p-8">
                <p className="text-slate-600 mb-6 leading-relaxed">Consult with specialized doctors from the comfort of your home through secure video calls.</p>
                <Link to="/services" className="text-emerald-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read More <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Service 2 */}
            <div className="card group">
              <div className="h-64 overflow-hidden relative">
                <img src="/images/clinic-lobby.png" alt="In-person Visit" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-6 left-6 text-2xl font-bold text-white">In-Person Visits</h3>
              </div>
              <div className="p-8">
                <p className="text-slate-600 mb-6 leading-relaxed">Book physical appointments at our modern clinics equipped with state-of-the-art facilities.</p>
                <Link to="/services" className="text-emerald-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read More <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-emerald-600 rounded-3xl p-8 flex flex-col justify-center text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
              <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                <Shield size={200} />
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-6">Need a Health Checkup?</h3>
                <p className="text-emerald-50 mb-8 leading-relaxed opacity-90">Get a comprehensive full-body checkup with personalized reports and doctor consultation.</p>
                <button className="bg-white text-emerald-600 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg">
                  Explore Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-6 animate-fade-in">
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-3xl">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 mb-4">
                    <Clock size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">24/7 Support</h4>
                  <p className="text-sm text-slate-500">Always available when you need us.</p>
                </div>
                <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xl shadow-slate-200/50">
                  <div className="w-12 h-12 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center text-white mb-4">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Secure Records</h4>
                  <p className="text-sm text-slate-500">Your data is encrypted and safe.</p>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="bg-slate-900 p-6 rounded-3xl text-white">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white mb-4">
                    <Activity size={24} />
                  </div>
                  <h4 className="font-bold mb-2">Real-time Updates</h4>
                  <p className="text-sm text-slate-400">Track your health progress instantly.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                    <MapPin size={24} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Multi-Location</h4>
                  <p className="text-sm text-slate-500">Find clinics near you easily.</p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-right">
              <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">We Care For Your Health <br/> Every Single Moment</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Our platform isn't just about booking appointments. It's about creating a lifestyle of wellness. We integrate state-of-the-art technology with human-centric care to provide the best healthcare experience.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Easy and fast appointment booking process',
                  'Access to globally certified medical professionals',
                  'Personalized health dashboard for every patient',
                  'Seamless integration with pharmacy and labs'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-slate-700">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary inline-flex">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Experience Better Healthcare?</h2>
              <p className="text-slate-300 text-lg mb-10 leading-relaxed">Join thousands of patients who trust ClinicCare for their medical needs. Your journey to wellness starts with a single click.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary w-full sm:w-auto text-lg py-4 px-10">
                  Join Now for Free
                </Link>
                <Link to="/contact" className="btn-secondary w-full sm:w-auto text-lg py-4 px-10 bg-transparent text-white border-slate-700 hover:bg-slate-800">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
