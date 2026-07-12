import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/admin/patients');
        setPatients(res.data.patients);
      } catch (error) {
        toast.error('Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <Layout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Patients</h1>
        <p className="text-slate-500">View registered patients in the system</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-sm text-slate-600">Patient Details</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Age / Gender</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Contact Info</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Address</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Registered On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500">Loading patients...</td></tr>
              ) : patients.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-slate-500">No patients found</td></tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <p className="font-medium text-slate-800">{patient.user?.name}</p>
                      <p className="text-xs text-slate-500">{patient.user?.email}</p>
                    </td>
                    <td className="p-4 text-slate-700">{patient.age} / {patient.gender}</td>
                    <td className="p-4 text-slate-700">{patient.phone}</td>
                    <td className="p-4 text-slate-700 max-w-xs truncate">{patient.address}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(patient.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ManagePatients;
