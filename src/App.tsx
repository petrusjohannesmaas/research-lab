import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import StudyGuidesLandingPage from './pages/StudyGuidesLandingPage';
import StudyGuideViewPage from './pages/StudyGuideViewPage';
import AboutPage from './pages/AboutPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/post/:slug" element={<PostPage />} />
            <Route path="/study-guides" element={<StudyGuidesLandingPage />} />
            <Route path="/study-guides/:id" element={<StudyGuideViewPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
