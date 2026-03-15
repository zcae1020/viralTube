import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Zap, Globe, ArrowUpRight, Award, Flame, Filter } from 'lucide-react';
import ChannelCard from '../components/ChannelCard';
import ChannelDetail from '../components/ChannelDetail';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const res = await axios.get(`${baseUrl}/api/videos`, {
          params: { searchQuery: '일상|브이로그|재테크|AI', overridePeriod: '1m' }
        });
        
        // Enrich data with mock fields for the new UI
        const enriched = res.data.map(ch => ({
          ...ch,
          opportunityScore: Math.floor(65 + Math.random() * 30),
          uploadFrequency: Math.floor(1 + Math.random() * 5),
          isNew: Math.random() > 0.7,
          category: ['일상', '금융', 'AI', '엔터'][Math.floor(Math.random() * 4)],
          topVideoId: ch.id, // Fallback
          latestVideoId: ch.id, // Fallback
          topVideoThumbnail: ch.thumbnail,
          latestVideoThumbnail: ch.thumbnail,
        }));
        
        setChannels(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const categories = [
    { name: '금융/재테크', growth: '+24%', color: 'var(--success)' },
    { name: '게임/엔터', growth: '+18%', color: 'var(--primary)' },
    { name: 'AI/IT 기술', growth: '+42%', color: 'var(--warning)' },
    { name: '교육/자기계발', growth: '+12%', color: 'var(--secondary)' },
  ];

  return (
    <div className="overflow-auto h-full p-6 no-scrollbar">
      <div className="mb-8 flex justify-between items-start">
        <div>
            <h1 className="text-3xl mb-1 font-bold">Trend Discovery</h1>
            <p className="text-secondary text-sm">급상승 채널과 벤치마킹 기회를 실시간으로 분석합니다.</p>
        </div>
        <div className="flex gap-3">
            <div className="flex gap-2 text-[10px] font-bold text-muted bg-card p-2 px-3 rounded-md border border-border items-center">
                <Globe size={12} className="text-primary" />
                KR Market <span className="text-success">Live</span>
            </div>
            <button className="btn btn-secondary p-2 py-1.5 flex gap-2">
                <Filter size={14} />
                <span className="text-xs">전체 필터</span>
            </button>
        </div>
      </div>

      {/* Summary Cards - Grid of 4 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card border-l-4 border-l-primary">
            <span className="stat-label flex items-center gap-1">
                < Award size={12} className="text-primary" />
                분석된 위성 채널
            </span>
            <h3 className="text-2xl m-0 mt-1">2,482</h3>
            <div className="flex items-center gap-1 text-[10px] text-success font-bold mt-1">
                <ArrowUpRight size={10} /> +12% vs last week
            </div>
        </div>
        <div className="card border-l-4 border-l-warning">
            <span className="stat-label flex items-center gap-1">
                <Flame size={12} className="text-warning" />
                성장 가속도 1위
            </span>
            <h3 className="text-2xl m-0 mt-1">AI-IT 기술</h3>
            <span className="text-[10px] text-muted">평균 조회 효율 2.4x</span>
        </div>
        <div className="card border-l-4 border-l-success">
            <span className="stat-label flex items-center gap-1">
                <Zap size={12} className="text-success fill-success" />
                실시간 떡상 감지
            </span>
            <h3 className="text-2xl m-0 mt-1 text-success">12</h3>
            <span className="text-[10px] text-muted">최근 24시간 이내 발생</span>
        </div>
        <div className="card border-l-4 border-l-secondary">
            <span className="stat-label flex items-center gap-1">
                <Globe size={12} className="text-secondary" />
                시장 평균 효율성
            </span>
            <h3 className="text-2xl m-0 mt-1">0.82x</h3>
            <span className="text-[10px] text-muted">구독자 대비 조회수</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Trending Niches */}
        <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm flex items-center gap-2 m-0 uppercase text-muted tracking-wider">
                    <TrendingUp size={16} className="text-primary" />
                    급상승 니치(Niche)
                </h3>
            </div>
            <div className="flex flex-col gap-2">
                {categories.map((cat, i) => (
                    <div key={i} className="card flex items-center justify-between p-3 px-4 hover:translate-x-1">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="font-bold text-xs">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-success text-[10px] font-bold">
                            {cat.growth}
                            <ArrowUpRight size={12} />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6 card bg-primary-glow border-primary/20">
                <h4 className="text-xs text-primary mb-2 flex items-center gap-2">
                    <Zap size={12} fill="currentColor" />
                    YouTube Studio Insight
                </h4>
                <p className="text-xs text-secondary leading-relaxed font-medium">
                    이번 주 <span className="text-white font-bold">얼굴 없는 정보 채널</span>들이 평균보다 3.2배 높은 CPM을 기록하고 있습니다. 지금 진입하기 가장 좋은 타이밍입니다.
                </p>
            </div>
        </div>

        {/* Right: Viral Channels List */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm flex items-center gap-2 m-0 uppercase text-muted tracking-wider">
                    <Flame size={16} className="text-warning fill-warning" />
                    오늘의 떡상 채널
                </h3>
                <button className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20" onClick={() => window.location.href='/explore'}>전체 리서치</button>
            </div>

            {loading ? (
                <div className="p-20 text-center text-muted card bg-sidebar border-dashed">
                    <Zap size={24} className="mx-auto mb-2 animate-bounce text-warning" />
                    실시간 트렌드 소싱 중...
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {channels.slice(0, 5).map((channel, i) => (
                        <ChannelCard 
                          key={i} 
                          channel={channel} 
                          onClick={() => setSelectedChannel(channel)}
                        />
                    ))}
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

export default DashboardPage;
