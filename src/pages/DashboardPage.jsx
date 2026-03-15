import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Zap, Globe, ArrowUpRight, Award, Flame, Filter } from 'lucide-react';
import ChannelCard from '../components/ChannelCard';
import ChannelDetail from '../components/ChannelDetail';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'viral', 'top-cat', 'above-avg'

  const stats = React.useMemo(() => {
    if (channels.length === 0) return { total: 0, avgRatio: '0.00', viral: 0, topCategory: '-', maxAvg: '0.0', catList: [] };
    
    const total = channels.length;
    const avgVal = channels.reduce((acc, ch) => acc + (ch.ratio || 0), 0) / total;
    const avgRatio = avgVal.toFixed(2);
    const viral = channels.filter(ch => (ch.ratio || 0) > 1.5).length;
    
    const catGroups = {};
    channels.forEach(ch => {
      if (!catGroups[ch.category]) catGroups[ch.category] = { sum: 0, count: 0 };
      catGroups[ch.category].sum += (ch.ratio || 0);
      catGroups[ch.category].count += 1;
    });
    
    let bestCat = '-';
    let maxAvgVal = 0;
    const catList = Object.entries(catGroups).map(([name, data]) => {
      const avg = data.sum / data.count;
      if (avg > maxAvgVal) {
        maxAvgVal = avg;
        bestCat = name;
      }
      return { name, avg: avg.toFixed(1), count: data.count };
    }).sort((a, b) => b.avg - a.avg);

    return { total, avgRatio, viral, topCategory: bestCat, maxAvg: maxAvgVal.toFixed(1), catList, rawAvg: avgVal };
  }, [channels]);

  const filteredChannels = React.useMemo(() => {
    if (filter === 'all') return channels;
    if (filter === 'viral') return channels.filter(ch => ch.ratio > 1.5);
    if (filter === 'top-cat') return channels.filter(ch => ch.category === stats.topCategory);
    if (filter === 'above-avg') return channels.filter(ch => ch.ratio > stats.rawAvg);
    return channels;
  }, [channels, filter, stats]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
        const res = await axios.get(`${baseUrl}/api/videos`, {
          params: { searchQuery: '일상|브이로그|재테크|AI|코딩|뉴스', overridePeriod: '1m' }
        });
        
        const enriched = res.data.map(ch => {
          // 발전 가능성 스케일 조정 (최대 99.9)
          // Ratio 1.0 기준 약 20~25점, Ratio 0.3 미만은 5점 이하로 배치
          const raw = (ch.ratio * 24) + (Math.log10(ch.views || 1) * 3) - 18;
          const score = Math.min(99.9, Math.max(1.2, raw)).toFixed(1);
          
          return {
            ...ch,
            opportunityScore: score,
            uploadFrequency: Math.floor(2 + Math.random() * 4), 
            isNew: (ch.ratio > 2.0),
            topVideoId: ch.id,
            latestVideoId: ch.id,
            topVideoThumbnail: ch.thumbnail,
            latestVideoThumbnail: ch.thumbnail,
          };
        });
        
        setChannels(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div className="overflow-auto h-full p-6 no-scrollbar">
      <div className="mb-8 flex justify-between items-start">
        <div>
            <h1 className="text-3xl mb-1 font-bold">Trend Discovery</h1>
            <p className="text-secondary text-sm">급상승 채널과 벤치마킹 기회를 실시간으로 분석합니다.</p>
        </div>
        <div className="flex gap-3">
            <div className="flex gap-2 text-[10px] font-bold text-muted bg-card p-2 px-3 rounded-md border border-border items-center cursor-pointer" onClick={() => setFilter('all')}>
                <Globe size={12} className="text-primary" />
                KR Market <span className="text-success">Live</span>
                {filter !== 'all' && <span className="ml-2 bg-primary/20 text-primary px-1.5 rounded">Filter Active</span>}
            </div>
            <button className="btn btn-secondary p-2 py-1.5 flex gap-2" onClick={() => setFilter('all')}>
                <Filter size={14} />
                <span className="text-xs">전체 필터 초기화</span>
            </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div 
            className={`card border-l-4 border-l-primary cursor-pointer transition-all hover:scale-[1.02] ${filter === 'all' ? 'bg-primary/5' : ''}`}
            onClick={() => setFilter('all')}
        >
            <span className="stat-label flex items-center gap-1">
                < Award size={12} className="text-primary" />
                분석된 위성 채널
            </span>
            <h3 className="text-2xl m-0 mt-1">{stats.total.toLocaleString()}</h3>
            <div className="flex items-center gap-1 text-[10px] text-success font-bold mt-1">
                <ArrowUpRight size={10} /> Live Data
            </div>
        </div>
        <div 
            className={`card border-l-4 border-l-warning cursor-pointer transition-all hover:scale-[1.02] ${filter === 'top-cat' ? 'bg-warning/5' : ''}`}
            onClick={() => setFilter('top-cat')}
        >
            <span className="stat-label flex items-center gap-1">
                <Flame size={12} className="text-warning" />
                성장 가속도 1위
            </span>
            <h3 className="text-2xl m-0 mt-1">{stats.topCategory}</h3>
            <span className="text-[10px] text-muted">평균 효율 {stats.maxAvg}x</span>
        </div>
        <div 
            className={`card border-l-4 border-l-success cursor-pointer transition-all hover:scale-[1.02] ${filter === 'viral' ? 'bg-success/5' : ''}`}
            onClick={() => setFilter('viral')}
        >
            <span className="stat-label flex items-center gap-1">
                <Zap size={12} className="text-success fill-success" />
                실시간 떡상 감지
            </span>
            <h3 className="text-2xl m-0 mt-1 text-success">{stats.viral}</h3>
            <span className="text-[10px] text-muted">최근 분석 기준 (Ratio &gt; 1.5)</span>
        </div>
        <div 
            className={`card border-l-4 border-l-secondary cursor-pointer transition-all hover:scale-[1.02] ${filter === 'above-avg' ? 'bg-secondary/5' : ''}`}
            onClick={() => setFilter('above-avg')}
        >
            <span className="stat-label flex items-center gap-1">
                <Globe size={12} className="text-secondary" />
                시장 평균 효율성
            </span>
            <h3 className="text-2xl m-0 mt-1">{stats.avgRatio}x</h3>
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
                {stats.catList.slice(0, 5).map((cat, i) => (
                    <div key={i} className="card flex items-center justify-between p-3 px-4 hover:translate-x-1 cursor-pointer" onClick={() => {
                        setFilter('top-cat');
                    }}>
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <div>
                                <div className="font-bold text-xs">{cat.name}</div>
                                <div className="text-[10px] text-muted">{cat.count}개 분석됨</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 text-success text-[10px] font-bold">
                                {cat.avg}x 효율
                                <ArrowUpRight size={12} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 card bg-primary-glow border-primary/20">
                <h4 className="text-xs text-primary mb-2 flex items-center gap-2">
                    <Zap size={12} fill="currentColor" />
                    Market Insight
                </h4>
                <p className="text-xs text-secondary leading-relaxed font-medium">
                    현재 분석된 <span className="text-white font-bold">{stats.total}개</span> 채널 중 <span className="text-success font-bold">{stats.viral}개</span>가 시장 평균보다 1.5배 이상 높은 조회 효율을 보이고 있습니다.
                </p>
            </div>
        </div>

        {/* Right: Viral Channels List */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm flex items-center gap-2 m-0 uppercase text-muted tracking-wider">
                    <Flame size={16} className="text-warning fill-warning" />
                    {filter === 'all' ? '오늘의 떡상 채널' : 
                     filter === 'viral' ? '실시간 떡상 정밀 분석' :
                     filter === 'top-cat' ? `${stats.topCategory} 집중 분석` : '시장 평균 이상 채널'}
                </h3>
                {filter !== 'all' && (
                    <button className="text-[10px] font-bold text-muted border border-border px-2 py-1 rounded hover:bg-card" onClick={() => setFilter('all')}>필터 해제</button>
                )}
            </div>

            {loading ? (
                <div className="p-20 text-center text-muted card bg-sidebar border-dashed">
                    <Zap size={24} className="mx-auto mb-2 animate-bounce text-warning" />
                    실시간 트렌드 소싱 중...
                </div>
            ) : filteredChannels.length === 0 ? (
                <div className="p-20 text-center text-muted card bg-sidebar border-dashed">
                    조건에 맞는 채널이 없습니다.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredChannels.slice(0, 8).map((channel, i) => (
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
