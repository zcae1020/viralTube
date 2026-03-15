import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Search, 
  Bookmark, 
  Settings, 
  Zap,
  Globe,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-main flex items-center gap-2">
        <Zap size={28} style={{ color: "var(--warning)" }} fill="var(--warning)" />
        <span style={{ letterSpacing: "-1px" }}>FINDER <span style={{ color: "var(--text-muted)" }}>x</span> PINT</span>
      </div>

      <nav className="flex-1 overflow-auto no-scrollbar">
        <div className="nav-label">Main Menu</div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home (Viral)</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={20} />
          <span>Explore (Search)</span>
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bookmark size={20} />
          <span>Saved (Benchmark)</span>
        </NavLink>

        <div className="nav-label">Quick Insights</div>
        <a href="#" className="nav-item">
          <Zap size={20} className="text-warning" />
          <span>24h Hot</span>
        </a>
        <a href="#" className="nav-item">
          <TrendingUp size={20} className="text-success" />
          <span>High Growth</span>
        </a>
        <a href="#" className="nav-item">
          <Globe size={20} />
          <span>Global Trends</span>
        </a>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
