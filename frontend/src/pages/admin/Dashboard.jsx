import React, { useState } from 'react';
import StatsCard from '../../components/StatsCard';
import Charts from '../../components/Charts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'activity'
  const [userFilter, setUserFilter] = useState('all');

  const dummyUsers = [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'patient', registered: '2026-09-18', status: 'Active' },
    { id: 2, name: 'Dr. Michael Ross', email: 'ross@hospital.org', role: 'doctor', registered: '2026-09-15', status: 'Active' },
    { id: 3, name: 'Dr. Elena Vance', email: 'elena@vancehealth.com', role: 'doctor', registered: '2026-09-12', status: 'Active' },
    { id: 4, name: 'Robert Chen', email: 'robert.chen@gmail.com', role: 'patient', registered: '2026-09-19', status: 'Active' },
    { id: 5, name: 'System Admin', email: 'admin@earlycare.org', role: 'admin', registered: '2026-09-01', status: 'Active' },
  ];

  const [usersList, setUsersList] = useState(dummyUsers);

  React.useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => {
        if (data?.users && data.users.length > 0) {
          const mapped = data.users.map((u) => ({
            id: u.id,
            name: u.full_name || u.email.split('@')[0],
            email: u.email,
            role: u.role || 'patient',
            registered: u.created_at ? u.created_at.split('T')[0] : '2026-09-20',
            status: u.is_active !== false ? 'Active' : 'Inactive',
          }));
          setUsersList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredUsers = usersList.filter(u => userFilter === 'all' || u.role === userFilter);


  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="bg-purple-500/30 text-purple-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            System Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Admin Management Console
          </h1>
          <p className="text-purple-100 text-sm mt-1 max-w-xl">
            Platform population metrics, user account roles management, and prediction telemetry logs.
          </p>
        </div>
      </div>

      {/* 3 Main Stat Cards */}
      <div className="flex flex-wrap gap-4">
        <StatsCard title="Total Patients" value="2,410" subtitle="Registered accounts" icon="🩺" trend="+14% this month" />
        <StatsCard title="Total Doctors" value="184" subtitle="Verified clinicians" icon="👨‍⚕️" trend="+6 new" />
        <StatsCard title="Total Predictions" value="18,940" subtitle="ML Model evaluations" icon="⚡" trend="Operational" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors ${activeTab === 'overview' ? 'border-b-2 border-purple-600 text-purple-700' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Analytics & Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 transition-colors ${activeTab === 'users' ? 'border-b-2 border-purple-600 text-purple-700' : 'text-slate-500 hover:text-slate-900'}`}
        >
          User Management UI
        </button>
        <button
          onClick={() => setActiveTab('activity')}
          className={`pb-3 transition-colors ${activeTab === 'activity' ? 'border-b-2 border-purple-600 text-purple-700' : 'text-slate-500 hover:text-slate-900'}`}
        >
          Recent Activity Log
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <Charts title="Platform Population Risk Metrics" />

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">System Performance Telemetry</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-600">ML Model Status</span>
                <span className="font-bold text-emerald-600">3 / 3 Models Active</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-600">Average Prediction Latency</span>
                <span className="font-bold text-slate-900">42 ms</span>
              </div>
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-600">API Health Index</span>
                <span className="font-bold text-emerald-600">99.98% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Management UI */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-base font-bold text-slate-900">User Account Roles & Permissions</h3>

            {/* Role Filter */}
            <div className="flex gap-2">
              {['all', 'patient', 'doctor', 'admin'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setUserFilter(roleKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    userFilter === roleKey
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {roleKey}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'doctor' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{u.registered}</td>
                    <td className="py-3 px-4">
                      <span className="text-emerald-600 font-bold">● {u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Recent Activity Table */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Platform Activity Audit Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event Description</th>
                  <th className="py-3 px-4">User Role</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3 px-4 text-slate-500">2026-09-20 22:15</td>
                  <td className="py-3 px-4 font-bold text-slate-800">Prediction API Evaluated for Patient #1042</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">Doctor</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Success (200 OK)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500">2026-09-20 21:40</td>
                  <td className="py-3 px-4 font-bold text-slate-800">Quick Screening Assessment Completed</td>
                  <td className="py-3 px-4 text-blue-700 font-semibold">Patient</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">Success (200 OK)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-500">2026-09-20 20:10</td>
                  <td className="py-3 px-4 font-bold text-slate-800">New Doctor Registration (Dr. Michael Ross)</td>
                  <td className="py-3 px-4 text-purple-700 font-semibold">System</td>
                  <td className="py-3 px-4 text-emerald-600 font-bold">User Created</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
