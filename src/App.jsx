import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CourseBrowser from './pages/courses/CourseBrowser';
import UniversityBrowser from './pages/universities/UniversityBrowser';
import UniversityProfile from './pages/universities/UniversityProfile';
import ProgrammeProfile from './pages/programmes/ProgrammeProfile';
import GuidanceWizard from './pages/guidance/GuidanceWizard';
import ChatAdvisor from './pages/chat/ChatAdvisor';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseBrowser />} />
        <Route path="/guidance" element={<GuidanceWizard />} />
        <Route path="/advisor" element={<ChatAdvisor />} />
        <Route path="/universities" element={<UniversityBrowser />} />
        <Route path="/universities/:id" element={<UniversityProfile />} />
        <Route path="/programmes/:id" element={<ProgrammeProfile />} />
      </Routes>
    </>
  );
}

export default App
