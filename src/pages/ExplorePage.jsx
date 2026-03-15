import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  LayoutGrid, 
  List as ListIcon, 
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  Tags,
  Zap,
  Users
} from 'lucide-react';
import ChannelCard from '../components/ChannelCard';
import { useSavedChannels } from '../hooks/useSavedChannels';
import ChannelDetail from '../components/ChannelDetail';

const ExplorePage = () => {
  const { savedChannels, saveChannel, removeChannel } = useSavedChannels();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [viewMode, setViewMode] = useState('card');
  const [period, setPeriod] = useState('1m');

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subRange, setSubRange] = useState([0, 1000000]);
  const [minRatio, setMinRatio] = useState(0);

  const categories = ['금융/재테크', 'IT/기술', '라이프스타일', '게임/엔터', '교육', '쇼츠 전용'];

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!keyword && selectedCategories.length === 0) return;
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const searchTerms = keyword || selectedCategories.join('|') || '유튜브';
      const res = await axios.get(`${baseUrl}/api/videos`, {
        params: { searchQuery: searchTerms, overridePeriod: period }
      });
      
      // Client-side filtering for simulated "Finder" experience
      let filtered = res.data;
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(c => selectedCategories.includes(c.category));
      }
      filtered = filtered.filter(c => c.subscribers >= subRange[0] && c.subscribers <= subRange[1]);
      filtered = filtered.filter(c => c.ratio >= minRatio);

      setResults(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategories.length > 0) handleSearch();
  }, [selectedCategories, subRange, minRatio]);

  return (
    <div className="finder-container">
      {/* Left Sidebar Filters */}
      <aside className="finder-sidebar no-scrollbar">
        <div className="filter-section">
          <div className="filter-title">
            <span>카테고리</span>
            <Filter size={14} />
          </div>
          <div className="checkbox-group">
            {categories.map(cat => (
              <label key={cat} className="checkbox-item">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                    else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                  }}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-title">
            <span>구독자 규모</span>
            <Users size={14} />
          </div>
          <input 
            type="range" 
            className="range-input" 
            min="0" 
            max="1000000" 
            step="10000"
            value={subRange[1]}
            onChange={(e) => setSubRange([0, parseInt(e.target.value)])}
          />
          <div className="flex justify-between text-xs text-muted">
            <span>0</span>
            <span>{Math.floor(subRange[1]/1000)}K</span>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-title">
            <span>채널 효율성 (Ratio)</span>
            <TrendingUp size={14} />
          </div>
          <select 
            className="form-input" 
            style={{ paddingLeft: '0.75rem' }}
            value={minRatio}
            onChange={(e) => setMinRatio(parseFloat(e.target.value))}
          >
            <option value="0">모든 비율</option>
            <option value="0.5">0.5x 이상 (건강함)</option>
            <option value="1.0">1.0x 이상 (떡상 중)</option>
            <option value="2.0">2.0x 이상 (초고속 성장)</option>
          </select>
        </div>

        <div className="filter-section">
          <div className="filter-title">
            <span>태그 필터</span>
            <Tags size={14} />
          </div>
          <div className="flex flex-wrap gap-2">
            {['얼굴없는채널', 'AI제작', '쇼츠전용', '롱폼전용', '글로벌'].map(tag => (
              <button key={tag} className="tag-badge hover:border-primary hover:text-primary transition-colors">
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="finder-content no-scrollbar">
        <div className="filter-bar" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="input-group">
              <Search className="input-icon" size={18} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="관심 있는 니치나 키워드를 입력하세요..." 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            <div className="view-toggles">
                <button 
                  className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => setViewMode('card')}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon size={16} />
                </button>
            </div>
            
            <button className="btn btn-primary btn-sm" onClick={handleSearch}>
                검색 실행
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="p-20 text-center text-muted">
              <Zap className="mx-auto mb-4 animate-pulse text-warning" size={48} />
              <h3>데이터 스칼로핑 중...</h3>
            </div>
          ) : results.length > 0 ? (
            <div className={viewMode === 'card' ? 'channel-list' : 'flex flex-col gap-3'}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="m-0 uppercase text-xs text-muted font-bold tracking-wider">
                  이 니치에서 발견된 {results.length}개의 채널
                </h4>
              </div>
              
              {results.map((channel, i) => (
                viewMode === 'card' ? (
                  <ChannelCard 
                    key={i}
                    channel={channel} 
                    onSave={saveChannel}
                    onRemove={removeChannel}
                    isSaved={savedChannels.some(c => c.id === channel.id)}
                    onClick={() => setSelectedChannel(channel)}
                  />
                ) : (
                  <div 
                    key={i} 
                    className="list-item" 
                    onClick={() => setSelectedChannel(channel)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={channel.thumbnail} alt="" className="w-10 h-10 rounded-full border border-border" />
                    <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{channel.channelTitle}</div>
                        <div className="flex gap-2 mt-1">
                            <span className="text-xs text-muted">{channel.category}</span>
                            {channel.tags.map(t => <span key={t} className="tag-badge">{t}</span>)}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold text-success">{channel.ratio}x</div>
                        <div className="text-xs text-muted">효율성</div>
                    </div>
                    <div className="text-right min-w-[100px]">
                        <div className="text-sm font-bold">${channel.estEarnings.toLocaleString()}</div>
                        <div className="text-xs text-muted">예상 수익(월)</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="p-20 text-center text-muted">
              <SlidersHorizontal size={48} className="mx-auto mb-4 opacity-20" />
              <h3>채널 파인더 준비됨</h3>
              <p>카테고리를 조정하거나 검색어를 입력하여 고효율 벤치마킹 대상을 발굴하세요.</p>
            </div>
          )}
        </div>
      </div>

      {selectedChannel && (
        <ChannelDetail 
          channel={selectedChannel} 
          onClose={() => setSelectedChannel(null)} 
        />
      )}
    </div>
  );
};

export default ExplorePage;
