import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChatButton from './components/FloatingChatButton';

// Public platform pages
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Diseases from './pages/Diseases';
import DiseaseDetails from './pages/DiseaseDetails';
import CheckDisease from './pages/CheckDisease';
import AIAssistant from './pages/AIAssistant';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import About from './pages/About';

// Auth / Role-specific portal pages
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAssessment from './pages/patient/Assessment';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAssessment from './pages/doctor/Assessment';
import AdminDashboard from './pages/admin/Dashboard';

function AccessDenied({ requiredRole, currentRole, onNavigate, onLogout }) {
  const roleNames = {
    patient: 'Patient',
    doctor: 'Doctor',
    admin: 'Platform Administrator',
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-rose-200 shadow-lg text-center">
      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
        🚫
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-200 bg-rose-50 text-xs font-bold text-rose-800 uppercase tracking-wider mb-3">
        Access Denied
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
        Unauthorized Portal
      </h2>
      <p className="text-xs text-slate-600 mb-6 leading-relaxed">
        This portal is restricted exclusively to verified{' '}
        <strong className="text-slate-900">{roleNames[requiredRole] || requiredRole}</strong> accounts.
        Your session is registered as{' '}
        <strong className="text-slate-900 capitalize">{currentRole || 'Guest'}</strong>.
      </p>
      <div className="space-y-3">
        {currentRole && (
          <button
            type="button"
            onClick={() => onNavigate(`${currentRole}-dashboard`)}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
          >
            Go to My Authorized Dashboard →
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (onLogout) onLogout();
            onNavigate('welcome');
          }}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
        >
          Sign In with a Different Account
        </button>
      </div>
    </div>
  );
}

function MainContent() {
  const [route, setRoute] = useState({ page: 'welcome', params: {} });
  const { role, isAuthenticated, logout } = useAuth();
  const { page, params } = route;

  const navigate = (nextPage, nextParams = {}) => {
    setRoute({ page: nextPage, params: nextParams });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      // First Page / Role Selection Welcome Screen
      case 'welcome':
        return <Welcome onNavigate={navigate} />;

      // Public platform pages
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'diseases':
        return <Diseases onNavigate={navigate} />;
      case 'disease-details':
        return <DiseaseDetails diseaseId={params.diseaseId} onNavigate={navigate} />;
      case 'check-disease':
        return <CheckDisease diseaseId={params.diseaseId} onNavigate={navigate} />;
      case 'ai-assistant':
        return <AIAssistant onNavigate={navigate} />;
      case 'feedback':
        return <Feedback onNavigate={navigate} />;
      case 'contact':
        return <Contact onNavigate={navigate} />;
      case 'about':
        return <About onNavigate={navigate} />;

      // Role-specific Authentication
      case 'login':
        return <Login onNavigate={navigate} roleParam={params.role || 'patient'} />;
      case 'register':
        return <Register onNavigate={navigate} roleParam={params.role || 'patient'} />;

      // Patient Protected Routes
      case 'patient-dashboard':
        if (!isAuthenticated) return <Login onNavigate={navigate} roleParam="patient" />;
        if (role !== 'patient') {
          return (
            <AccessDenied
              requiredRole="patient"
              currentRole={role}
              onNavigate={navigate}
              onLogout={logout}
            />
          );
        }
        return <PatientDashboard onNavigate={navigate} />;

      case 'patient-assessment':
        if (!isAuthenticated) return <Login onNavigate={navigate} roleParam="patient" />;
        if (role !== 'patient') {
          return (
            <AccessDenied
              requiredRole="patient"
              currentRole={role}
              onNavigate={navigate}
              onLogout={logout}
            />
          );
        }
        return <PatientAssessment onNavigate={navigate} />;

      // Doctor Protected Routes
      case 'doctor-dashboard':
        if (!isAuthenticated) return <Login onNavigate={navigate} roleParam="doctor" />;
        if (role !== 'doctor') {
          return (
            <AccessDenied
              requiredRole="doctor"
              currentRole={role}
              onNavigate={navigate}
              onLogout={logout}
            />
          );
        }
        return <DoctorDashboard onNavigate={navigate} />;

      case 'doctor-assessment':
        if (!isAuthenticated) return <Login onNavigate={navigate} roleParam="doctor" />;
        if (role !== 'doctor') {
          return (
            <AccessDenied
              requiredRole="doctor"
              currentRole={role}
              onNavigate={navigate}
              onLogout={logout}
            />
          );
        }
        return <DoctorAssessment onNavigate={navigate} />;

      // Admin Protected Routes
      case 'admin-dashboard':
        if (!isAuthenticated) return <Login onNavigate={navigate} roleParam="admin" />;
        if (role !== 'admin') {
          return (
            <AccessDenied
              requiredRole="admin"
              currentRole={role}
              onNavigate={navigate}
              onLogout={logout}
            />
          );
        }
        return <AdminDashboard onNavigate={navigate} />;

      default:
        return <Welcome onNavigate={navigate} />;
    }
  };

  // Hide the floating chat launcher while on the dedicated assistant page or welcome page
  const showFloatingChat = page !== 'ai-assistant' && page !== 'welcome';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar onNavigate={navigate} currentPage={page} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
      {showFloatingChat && (
        <FloatingChatButton onOpenFullAssistant={() => navigate('ai-assistant')} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
