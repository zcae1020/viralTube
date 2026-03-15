import React from 'react';
import { 
  X, 
  ExternalLink, 
  TrendingUp, 
  MessageSquare, 
  Eye, 
  BarChart, 
  Calendar,
  Zap,
  CheckCircle2,
  Target,
  FileText,
  Clock,
  PlayCircle
} from 'lucide-react';
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ChannelDetail = ({ channel, onClose }) => {
  // Enhanced Mock data for display
  const viewHistory = [
    { name: 'Video 1', views: 32000 },
    { name: 'Video 2', views: 28000 },
    { name: 'Video 3', views: 125000 },
    { name: 'Video 4', views: 41000 },
    { name: 'Video 5', views: 85000 },
    { name: 'Video 6', views: 21000 },
    { name: 'Video 7', views: 65000 },
  ];

  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-2xl bg-sidebar border-l border-border h-full shadow-2xl flex flex-col overflow-hidden animate-slide-in">
        {/* Sticky Header */}
        <div className="p-5 border-bottom border-border flex items-center justify-between bg-[#11141b]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <img src={channel.thumbnail} alt="" className="w-12 h-12 rounded-full border border-border shadow-lg" />
            <div>
              <h2 className="text-xl m-0 font-bold">{channel.channelTitle}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="badge badge-secondary text-[10px] py-0.5">LEVEL 5 분석</span>
                <a 
                    href={channel.channelId ? `https://youtube.com/channel/${channel.channelId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.channelTitle)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-[11px] font-bold"
                >
                    오픈 채널 <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-card rounded-xl transition-all border border-transparent hover:border-border">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 no-scrollbar pb-24">
          {/* 1. Opportunity Score & Growth Pulse */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="card bg-gradient-to-br from-warning/10 to-transparent border-warning/20">
                <div className="flex items-center justify-between mb-2">
                    <span className="stat-label text-warning flex items-center gap-1">
                        <Target size={12} /> Opportunity Score
                    </span>
                    <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl m-0 text-white font-black">{channel.opportunityScore || 82}</h3>
                    <span className="text-sm text-secondary font-bold">/ 100</span>
                </div>
                <p className="text-[10px] text-muted mt-2 font-medium">따라 만들었을 때 성공 확률 <strong>매우 높음</strong></p>
            </div>
            
            <div className="card border-success/20">
                <span className="stat-label text-success flex items-center gap-1 mb-2">
                    <TrendingUp size={12} /> Growth Acceleration
                </span>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl m-0 text-success font-black">{channel.velocity || 12}%</h3>
                    <span className="text-sm text-secondary font-bold">24h Gain</span>
                </div>
                <p className="text-[10px] text-muted mt-2 font-medium">카테고리 평균 대비 <strong>+3.2배</strong> 고속 성장 중</p>
            </div>
          </div>

          {/* 2. AI Content Strategy Summary */}
          <div className="mb-8 p-5 bg-primary-glow border border-primary/20 rounded-2xl">
            <h4 className="flex items-center gap-2 text-primary mb-4 text-sm font-bold uppercase tracking-widest">
              <Zap size={18} fill="currentColor" />
              AI 채널 패턴 분석 요약
            </h4>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="text-[10px] text-primary/60 font-bold uppercase mb-1 flex items-center gap-1">
                            <FileText size={10} /> 콘텐츠 포맷
                        </div>
                        <p className="text-xs font-bold leading-relaxed">{channel.contentType === 'shorts' ? '숏폼 기반' : '정보 전달형 롱폼'} + 얼굴 없는 채널</p>
                    </div>
                    <div>
                        <div className="text-[10px] text-primary/60 font-bold uppercase mb-1 flex items-center gap-1">
                            <Clock size={10} /> 영상 길이 패턴
                        </div>
                        <p className="text-xs font-bold leading-relaxed">평균 8분 20초 (미드롤 광고 최적화)</p>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div>
                        <div className="text-[10px] text-primary/60 font-bold uppercase mb-1 flex items-center gap-1">
                            <Calendar size={10} /> 업로드 전략
                        </div>
                        <p className="text-xs font-bold leading-relaxed">주 2~3회 (화/목/일 오후 8시 고정)</p>
                    </div>
                    <div>
                        <div className="text-[10px] text-primary/60 font-bold uppercase mb-1 flex items-center gap-1">
                            <MessageSquare size={10} /> 주요 콘텐츠 주제
                        </div>
                        <p className="text-xs font-bold leading-relaxed">{channel.category} 내 고수익 트렌드 집중</p>
                    </div>
                </div>
            </div>
          </div>

          {/* 3. Performance Chart */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase text-muted tracking-widest flex items-center gap-2 m-0">
                    <BarChart size={16} /> 최근 영상 성과 지표 (7-Day)
                </h4>
                <div className="text-[10px] font-bold text-success">평균 조회수 42.1K</div>
            </div>
            <div className="h-48 card p-4 bg-[#161a23]/50">
                <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={viewHistory}>
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#11141b', border: '1px solid var(--border)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--primary)', fontSize: '11px' }}
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                        />
                        <Bar dataKey="views" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={24} />
                    </ReBarChart>
                </ResponsiveContainer>
            </div>
          </div>

          {/* 4. Benchmarking Deep-Dive */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase text-muted tracking-widest flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                성공 복제 가이드 (Success Patterns)
            </h4>
            <div className="space-y-3">
                {[
                  { title: '썸네일 후킹', desc: '강한 명도 대비와 의문문형 카피를 활용하여 클릭률(CTR)을 카테고리 평균 대비 40% 향상시켰습니다.', color: 'var(--primary)' },
                  { title: '초반 30초 전략', desc: '인트로 없이 바로 핵심 결론을 제시하고, 5초마다 시각적 전환을 주어 유지율을 높였습니다.', color: 'var(--success)' },
                  { title: '수익화 모델', desc: '조회수 수익 외에도 고정 댓글을 통한 쿠팡 파트너스/전자책 판매가 활발합니다.', color: 'var(--warning)' }
                ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 card border-none bg-card/60 hover:bg-card transition-colors">
                        <div className="w-1 h-8 rounded-full mt-1" style={{ backgroundColor: item.color }} />
                        <div className="flex-1">
                            <div className="text-xs font-bold text-white mb-1 uppercase tracking-tight">{item.title}</div>
                            <p className="text-[11px] text-secondary leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 border-top border-border bg-sidebar/80 backdrop-blur-lg absolute bottom-0 left-0 right-0">
          <button className="btn btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-black tracking-tight shadow-lg shadow-primary/20">
            <Bookmark size={18} fill="currentColor" />
            이 채널을 벤치마킹 장부에 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetail;
