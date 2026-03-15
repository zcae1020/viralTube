import React from 'react';
import { 
  X, 
  ExternalLink, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  BarChart, 
  Calendar,
  AlertCircle,
  Zap
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ChannelDetail = ({ channel, onClose }) => {
  // Mock data for average views
  const viewHistory = [
    { name: 'Video 1', views: 12000 },
    { name: 'Video 2', views: 8000 },
    { name: 'Video 3', views: 25000 },
    { name: 'Video 4', views: 11000 },
    { name: 'Video 5', views: 45000 },
  ];

  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-sidebar border-l border-border h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        {/* Header */}
        <div className="p-6 border-bottom border-border flex items-center justify-between bg-main">
          <div className="flex items-center gap-4">
            <img src={channel.thumbnail} alt="" className="w-12 h-12 rounded-full border border-border" />
            <div>
              <h2 className="text-xl m-0">{channel.channelTitle}</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">분석 개요</span>
                <a 
                    href={channel.channelId ? `https://youtube.com/channel/${channel.channelId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.channelTitle)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-xs"
                >
                    채널 방문 <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 no-scrollbar">
          {/* AI Insight Box */}
          <div className="mb-8 p-4 bg-primary-glow border border-primary/20 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
                <div className="badge badge-warning text-[10px]">PINT AI</div>
            </div>
            <h4 className="flex items-center gap-2 text-primary mb-2">
              <Zap size={18} />
              성장 인사이트
            </h4>
            <p className="text-sm leading-relaxed">
              이 채널은 현재 <span className="text-primary font-bold">{channel.category}</span> 니치 내 <strong>상위 5%</strong>의 퍼포먼스를 기록 중입니다. 
              조회수 효율(Ratio)은 {channel.ratio}x로, 카테고리 평균(0.4x)을 크게 상회합니다.
              핵심 전략: <strong>{channel.tags?.join(', ') || '고유지율 콘텐츠'}</strong> 패턴 분석 권장.
            </p>
          </div>

          {/* New Hybrid Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="card">
                <span className="stat-label">평균 조회수</span>
                <h3 className="text-primary m-0">18.4K</h3>
                <span className="text-xs text-muted">영상당 (최근 30일)</span>
            </div>
            <div className="card">
                <span className="stat-label">예상 월수익</span>
                <h3 className="text-success m-0">${channel.estEarnings?.toLocaleString()}</h3>
                <span className="text-xs text-muted">추정 금액</span>
            </div>
            <div className="card">
                <span className="stat-label">분야별 순위</span>
                <h3 className="m-0">#12</h3>
                <span className="text-xs text-muted">{channel.category} 내</span>
            </div>
            <div className="card">
                <span className="stat-label">업로드 주기</span>
                <h3 className="m-0">매우 규칙적</h3>
                <span className="text-xs text-muted">주당 3.2회 업로드</span>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="mb-10">
            <h4 className="mb-4 flex items-center gap-2">
                <BarChart size={18} className="text-muted" />
                최근 영상 성과 추이
            </h4>
            <div className="h-64 card p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={viewHistory}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#161a23', border: '1px solid #333' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="views" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                    </ReBarChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* Benchmarking Points */}
          <div>
            <h4 className="mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-success" />
                핵심 성공 패턴
            </h4>
            <div className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
                    <div>
                        <div className="text-xs font-bold uppercase mb-1">썸네일 전략</div>
                        <p className="text-sm text-secondary">강렬한 대비의 텍스트와 화살표 포인터 사용. "결과" 중심의 이미지 배치.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                    <div className="mt-1 w-2 h-2 rounded-full bg-success" />
                    <div>
                        <div className="text-xs font-bold uppercase mb-1">제목 후킹</div>
                        <p className="text-sm text-secondary">"X일 만에 Y 한 방법"과 같은 반복적인 성공 공식 패턴 사용.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-top border-border bg-sidebar">
          <button className="btn btn-primary w-full">
            벤치마킹 리스트에 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetail;
