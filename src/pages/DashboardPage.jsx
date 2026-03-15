import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Zap, Clock, Users, Globe, ArrowUpRight } from 'lucide-react';
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
          params: { searchQuery: '일상|브이로그', overridePeriod: '1m' }
        });
        setChannels(res.data);
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
      <div className="mb-10 flex justify-between items-end">
        <div>
            <h1 className="text-3xl mb-2 font-bold">시장 인텔리전스</h1>
            <p className="text-secondary">PINT x 채널파인더 하이브리드 분석 메트릭입니다.</p>
        </div>
        <div className="flex gap-2 text-xs font-bold text-muted bg-sidebar p-2 rounded-lg border border-border">
            <Globe size={14} className="text-primary" />
            글로벌 트렌드: <span className="text-primary">실시간</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card">
            <span className="stat-label">누적 발견 채널</span>
            <h3 className="m-0">2,482</h3>
            <span className="text-xs text-muted">분석된 총 채널 수</span>
        </div>
        <div className="card">
            <span className="stat-label">성장 가속도 1위</span>
            <h3 className="m-0 text-warning">AI-IT 기술</h3>
            <span className="text-xs text-muted">현재 트렌드 카테고리</span>
        </div>
        <div className="card">
            <span className="stat-label">실시간 떡상 발생</span>
            <h3 className="m-0 text-success">12</h3>
            <span className="text-xs text-muted">최근 24시간 이내</span>
        </div>
        <div className="card">
            <span className="stat-label">시장 평균 효율성</span>
            <h3 className="m-0">0.82x</h3>
            <span className="text-xs text-muted">조회수/구독자 평균</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Trends */}
        <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg flex items-center gap-2 m-0">
                    <TrendingUp size={20} className="text-primary" />
                    급상승 니치(Niche)
                </h3>
            </div>
            <div className="flex flex-col gap-3">
                {categories.map((cat, i) => (
                    <div key={i} className="card flex items-center justify-between p-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="font-bold text-sm">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-success text-xs font-bold">
                            {cat.growth}
                            <ArrowUpRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 card bg-primary-glow border-primary/20">
                <h4 className="text-sm text-primary mb-2 flex items-center gap-2">
                    <Zap size={14} fill="currentColor" />
                    파인더 팁
                </h4>
                <p className="text-xs text-secondary leading-relaxed">
                    이번 주 <span className="text-white font-bold">기술</span> 카테고리의 얼굴 없는 채널들이 평균보다 2.4배 높은 조회 효율을 기록하고 있습니다.
                </p>
            </div>
        </div>

        {/* Viral Channels */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg flex items-center gap-2 m-0">
                    <Zap size={20} className="text-warning fill-warning" />
                    오늘의 떡상 채널
                </h3>
                <button className="text-xs font-bold text-primary hover:underline" onClick={() => window.location.href='/explore'}>채널 파인더 바로가기</button>
            </div>

            {loading ? (
                <div className="p-20 text-center text-muted card bg-sidebar">실시간 트렌드 소싱 중...</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {channels.slice(0, 4).map((channel, i) => (
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
