import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, UserCog, LogOut, CalendarCheck } from 'lucide-react';
import { Stethoscope } from 'lucide-react';

const Layout = ({ children, role }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/admin/manage-doctors', name: 'Manage Doctors', icon: <UserCog size={20} /> },
      { path: '/admin/manage-patients', name: 'Manage Patients', icon: <Users size={20} /> },
    ],
    doctor: [
      { path: '/doctor/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/doctor/appointments', name: 'Appointments', icon: <CalendarCheck size={20} /> },
      { path: '/doctor/availability', name: 'Availability', icon: <UserCog size={20} /> },
    ],
    patient: [
      { path: '/patient/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/patient/book-appointment', name: 'Book Appointment', icon: <CalendarCheck size={20} /> },
      { path: '/patient/appointments', name: 'My Appointments', icon: <Users size={20} /> },
    ]
  };

  const links = menuItems[role] || [];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">

        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold tracking-tight text-[#008a45] flex items-center gap-3">
              {/* Icon Container with built-in Tailwind Pulse animation */}
              <div className="w-9 h-9 rounded-lg bg-[#e6f9f0] flex items-center justify-center animate-pulse">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>

              JC ClinicCare
            </h1>
          </div>
        </aside>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="mb-4 px-4">
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 md:hidden">
          <h1 className="text-xl font-bold tracking-tight text-primary-600">JC ClinicCare</h1>
          <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-red-600">Logout</button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
