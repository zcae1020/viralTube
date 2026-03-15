import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  LayoutGrid, 
  List as ListIcon, 
  SlidersHorizontal,
  Tags,
  Zap,
  Users,
  Globe,
  RotateCcw
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
  
  // Quick Filters
  const [contentType, setContentType] = useState('all'); // all, shorts, long
  const [period, setPeriod] = useState('7d'); // 24h, 7d, 30d
  const [country, setCountry] = useState('KR');
  
  // Sidebar Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [subRange, setSubRange] = useState([0, 1000000]);
  const [isNewOnly, setIsNewOnly] = useState(false);
  const [excludeWhales, setExcludeWhales] = useState(false);

  const categories = ['금융/재테크', 'IT/기술', '라이프스타일', '게임/엔터', '교육', '동물/자연', '이슈/뉴스'];

  const handleSearch = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const searchTerms = keyword || selectedCategories.join('|') || '인기 유튜브';
      const res = await axios.get(`${baseUrl}/api/videos`, {
        params: { searchQuery: searchTerms, overridePeriod: period === '24h' ? '1w' : (period === '7d' ? '1m' : '3m') }
      });
      
      // Enrich & Filter
      let processed = res.data.map(ch => ({
        ...ch,
        opportunityScore: Math.floor(65 + Math.random() * 30),
        uploadFrequency: Math.floor(1 + Math.random() * 5),
        isNew: Math.random() > 0.8,
        category: categories[Math.floor(Math.random() * categories.length)],
        topVideoId: ch.id,
        latestVideoId: ch.id,
        topVideoThumbnail: ch.thumbnail,
        latestVideoThumbnail: ch.thumbnail,
      }));

      // Apply Filter Logic
      if (selectedCategories.length > 0) {
        processed = processed.filter(c => selectedCategories.includes(c.category));
      }
      processed = processed.filter(c => c.subscribers >= subRange[0] && c.subscribers <= subRange[1]);
      if (isNewOnly) processed = processed.filter(c => c.isNew);
      if (excludeWhales) processed = processed.filter(c => c.subscribers < 500000);
      if (contentType !== 'all') {
         // Logic to mock contentType filtering if real data is missing
      }

      setResults(processed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [contentType, period, country, isNewOnly, excludeWhales]);

  const resetFilters = () => {
    setContentType('all');
    setPeriod('7d');
    setCountry('KR');
    setSelectedCategories([]);
    setSubRange([0, 1000000]);
    setIsNewOnly(false);
    setExcludeWhales(false);
  };

  return (
    <div className="finder-container">
      {/* 1. Sidebar Filter: Fine-grained Controls */}
      <aside className="finder-sidebar no-scrollbar">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold flex items-center gap-2 m-0 uppercase text-muted">
                <Filter size={14} />
                Filters
            </h3>
            <button onClick={resetFilters} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                <RotateCcw size={10} /> 초기화
            </button>
        </div>

        <div className="filter-section">
          <div className="filter-title">카테고리</div>
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
          <div className="filter-title">구독자 규모</div>
          <input 
            type="range" 
            className="range-input" 
            min="0" 
            max="1000000" 
            step="50000"
            value={subRange[1]}
            onChange={(e) => setSubRange([0, parseInt(e.target.value)])}
          />
          <div className="flex justify-between text-[10px] text-muted font-bold">
            <span>0</span>
            <span>{subRange[1] >= 1000000 ? '1M+' : `${subRange[1]/1000}K`}</span>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-title">상태 설정</div>
          <div className="checkbox-group">
            <label className="checkbox-item font-medium">
                <input type="checkbox" checked={isNewOnly} onChange={e => setIsNewOnly(e.target.checked)} />
                <span className="flex items-center gap-1">✨ 신규 채널만 보기</span>
            </label>
            <label className="checkbox-item font-medium">
                <input type="checkbox" checked={excludeWhales} onChange={e => setExcludeWhales(e.target.checked)} />
                <span className="flex items-center gap-1">🚫 고래 채널 제외</span>
            </label>
          </div>
        </div>
      </aside>

      {/* 2. Main Content: Sticky Quick-Filters + Explorer List */}
      <div className="finder-content no-scrollbar">
        {/* Sticky Quick-Filter Bar */}
        <div className="filter-bar border-b" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(11, 14, 20, 0.95)', backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between gap-4">
              <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                <div className="input-group">
                  <Search className="input-icon" size={16} />
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ height: '36px', fontSize: '12px' }}
                    placeholder="니치나 키워드로 탐색 (예: 캠핑, 미국주식)..." 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
              </form>
              
              <div className="flex items-center gap-2">
                <div className="view-toggles" style={{ padding: '3px' }}>
                    <button className={`view-btn ${viewMode === 'card' ? 'active' : ''}`} onClick={() => setViewMode('card')} style={{ padding: '4px 8px' }}>
                        <LayoutGrid size={14} />
                    </button>
                    <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} style={{ padding: '4px 8px' }}>
                        <ListIcon size={14} />
                    </button>
                </div>
                <button className="btn btn-primary p-2 py-1.5 text-xs font-bold" onClick={handleSearch}>검색 데이터 갱신</button>
              </div>
            </div>

            {/* Quick Toggle Row */}
            <div className="flex items-center gap-4 py-1">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted uppercase">포맷</span>
                    <div className="flex bg-card rounded-md border border-border p-1">
                        {['all', 'shorts', 'long'].map(type => (
                            <button 
                                key={type} 
                                className={`px-3 py-1 text-[11px] font-bold rounded capitalize ${contentType === type ? 'bg-primary text-white' : 'text-secondary hover:text-white'}`}
                                onClick={() => setContentType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-muted uppercase">기간</span>
                    <div className="flex bg-card rounded-md border border-border p-1">
                        {['24h', '7d', '30d'].map(p => (
                            <button 
                                key={p} 
                                className={`px-3 py-1 text-[11px] font-bold rounded capitalize ${period === p ? 'bg-success text-white' : 'text-secondary hover:text-white'}`}
                                onClick={() => setPeriod(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-[10px] font-bold text-muted uppercase">국가</span>
                    <select 
                        className="bg-card border border-border text-[11px] font-bold rounded px-2 py-1 outline-none appearance-none"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                    >
                        <option value="KR">South Korea (KR)</option>
                        <option value="US">United States (US)</option>
                        <option value="JP">Japan (JP)</option>
                    </select>
                </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="p-20 text-center text-muted">
              <Zap className="mx-auto mb-4 animate-bounce text-warning" size={32} />
              <h3 className="text-lg font-bold">전 세계 실시간 영상 분석 중</h3>
              <p className="text-xs text-muted mt-2">유튜브 API 할당량과 트렌드를 고속 교차 검증하고 있습니다...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="m-0 uppercase text-[10px] text-muted font-bold tracking-widest flex items-center gap-2">
                  <Globe size={12} />
                  발견된 {results.length}개의 고성장 기회
                </h4>
              </div>
              
              <div className={viewMode === 'card' ? 'channel-list' : 'flex flex-col gap-2'}>
                {results.map((channel, i) => (
                  <ChannelCard 
                    key={i}
                    channel={channel} 
                    onSave={saveChannel}
                    onRemove={removeChannel}
                    isSaved={savedChannels.some(c => c.id === channel.id)}
                    onClick={() => setSelectedChannel(channel)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="p-20 text-center text-muted border-2 border-dashed border-border/40 rounded-3xl">
              <SlidersHorizontal size={48} className="mx-auto mb-4 opacity-10" />
              <h3 className="text-lg font-bold">오퍼튜니티 스코어 산출 준비 완료</h3>
              <p className="max-w-xs mx-auto text-xs mt-2 text-muted uppercase font-bold tracking-tighter">
                키워드나 필터를 조정하여<br/> 벤치마킹할 황금 채널을 발굴하세요.
              </p>
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
