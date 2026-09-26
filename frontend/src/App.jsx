import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingChatButton from './components/FloatingChatButton';

// New public platform pages
import Home from './pages/Home';
import Diseases from './pages/Diseases';
import DiseaseDetails from './pages/DiseaseDetails';
import CheckDisease from './pages/CheckDisease';
import AIAssistant from './pages/AIAssistant';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';
import About from './pages/About';

// Existing auth / role-portal pages (preserved for future backend integration)
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import PatientAssessment from './pages/patient/Assessment';
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAssessment from './pages/doctor/Assessment';
import AdminDashboard from './pages/admin/Dashboard';

function MainContent() {
  const [route, setRoute] = useState({ page: 'home', params: {} });
  const { role } = useAuth();
  const { page, params } = route;

  const navigate = (nextPage, nextParams = {}) => {
    setRoute({ page: nextPage, params: nextParams });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (page) {
      // Public platform
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

      // Auth
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'register':
        return <Register onNavigate={navigate} />;

      // Patient Routes
      case 'patient-dashboard':
        return <PatientDashboard onNavigate={navigate} />;
      case 'patient-assessment':
        return <PatientAssessment onNavigate={navigate} />;

      // Doctor Routes
      case 'doctor-dashboard':
        return <DoctorDashboard onNavigate={navigate} />;
      case 'doctor-assessment':
        return <DoctorAssessment onNavigate={navigate} />;

      // Admin Routes
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={navigate} />;

      default:
        return <Home onNavigate={navigate} />;
    }
  };

  // Hide the floating chat launcher while already on the dedicated assistant page.
  const showFloatingChat = page !== 'ai-assistant';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar onNavigate={navigate} currentPage={page} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
      {showFloatingChat && <FloatingChatButton onOpenFullAssistant={() => navigate('ai-assistant')} />}
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
