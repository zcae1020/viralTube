import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ExplorePage from './pages/ExplorePage';
import SavedPage from './pages/SavedPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <header className="top-header">
            <h2 className="text-lg">YouTube Sourcing Dashboard</h2>
            <div className="ml-auto flex items-center gap-4">
              {/* API Key Status or Quick Search could go here */}
            </div>
          </header>
          
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/saved" element={<SavedPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
