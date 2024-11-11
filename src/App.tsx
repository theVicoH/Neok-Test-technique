import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateProfilePage from './pages/CreateProfilePage';
import Dashboard from './components/features/Dashboard';
import AuthGuard from './components/features/AuthGuard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/create-profile" 
          element={
            <AuthGuard requireProfile={false}>
              <CreateProfilePage />
            </AuthGuard>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}