import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LifeBuoy } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Illustration Container */}
        <div className="relative mb-12 animate-fade-in flex justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-10" />
          <img 
            src="/images/access-denied.png" 
            alt="Access Denied" 
            className="w-full max-w-sm h-auto drop-shadow-2xl animate-float"
          />
        </div>

        {/* Content */}
        <div className="animate-fade-in delay-200">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full mb-6 font-bold text-sm tracking-wide uppercase border border-rose-100">
            <ShieldAlert size={18} />
            Unauthorized Access
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Whoops! Restricted <span className="text-emerald-600">Area.</span>
          </h1>
          
          <p className="text-lg text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
            It looks like you don't have the necessary permissions to access this page. Please make sure you're logged in with the correct account or return to the safety of our home page.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 text-lg"
            >
              <Home size={20} />
              Back to Home
            </Link>
            <Link 
              to="/login" 
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-8 text-lg"
            >
              <ArrowLeft size={20} />
              Login Again
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <p className="text-slate-500 flex items-center justify-center gap-2 font-medium">
              Believe this is a mistake?
              <Link to="/contact" className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 transition-colors">
                <LifeBuoy size={16} /> Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
