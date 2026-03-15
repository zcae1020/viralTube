import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  TrendingUp, 
  Search, 
  Bookmark, 
  BarChart2, 
  Settings, 
  Zap,
  Globe,
  Youtube
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-main flex items-center gap-2">
        <Zap size={28} style={{ color: "var(--warning)" }} fill="var(--warning)" />
        <span style={{ letterSpacing: "-1px" }}>FINDER <span style={{ color: "var(--text-muted)" }}>x</span> PINT</span>
      </div>

      <nav className="flex-1 overflow-auto no-scrollbar">
        <div className="nav-label">워크스페이스</div>
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={20} />
          <span>시장 인텔리전스</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={20} />
          <span>채널 파인더</span>
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bookmark size={20} />
          <span>성장 노트</span>
        </NavLink>

        <div className="nav-label">빠른 필터</div>
        <a href="#" className="nav-item">
          <Zap size={20} className="text-warning" />
          <span>24시간 급상승</span>
        </a>
        <a href="#" className="nav-item">
          <TrendingUp size={20} className="text-success" />
          <span>성장 가속도</span>
        </a>
        <a href="#" className="nav-item">
          <Globe size={20} />
          <span>글로벌 트렌드</span>
        </a>
      </nav>

      <div className="mt-auto pt-4 border-t-slate">
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>환경 설정</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
