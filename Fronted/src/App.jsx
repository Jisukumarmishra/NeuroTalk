import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import ScenariosPage from './pages/ScenariosPage';
import PracticePage from './pages/PracticePage';
import DashboardPage from './pages/DashboardPage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>
    </Router>
  );
}
