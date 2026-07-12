import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import { Users, Stethoscope, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docsRes, patsRes, apptsRes] = await Promise.all([
          api.get('/admin/doctors'),
          api.get('/admin/patients'),
          api.get('/admin/appointments')
        ]);
        
        setStats({
          doctors: docsRes.data.count || 0,
          patients: patsRes.data.count || 0,
          appointments: apptsRes.data.count || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout role="admin">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Overview of your clinic's activity</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mr-3"></div>
           Loading metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 flex items-center gap-4 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Stethoscope size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Doctors</p>
              <p className="text-3xl font-bold text-slate-800">{stats.doctors}</p>
            </div>
          </div>

          <div className="card p-6 flex items-center gap-4 border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Patients</p>
              <p className="text-3xl font-bold text-slate-800">{stats.patients}</p>
            </div>
          </div>

          <div className="card p-6 flex items-center gap-4 border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Appointments</p>
              <p className="text-3xl font-bold text-slate-800">{stats.appointments}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
