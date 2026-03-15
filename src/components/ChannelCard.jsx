import React from 'react';
import { TrendingUp, Play, Bookmark, Zap, ExternalLink, BarChart2, Clock, Calendar } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ChannelCard = ({ channel, onSave, isSaved, onRemove, onClick }) => {
  // Mock trend data if not provided
  const trendData = channel.trend || [
    { v: 10 }, { v: 12 }, { v: 11 }, { v: 14 }, { v: 18 }, { v: 16 }, { v: 22 }
  ];

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 100000000) return (num / 100000000).toFixed(1).replace('.0', '') + '억';
    if (num >= 10000) return (num / 10000).toFixed(1).replace('.0', '') + '만';
    return num.toLocaleString();
  };

  const onCardClick = (e) => {
    if (onClick) onClick();
  };

  return (
    <div className="card channel-card group" onClick={onCardClick}>
      {/* 1. Channel Core Identity */}
      <div className="channel-info" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <img src={channel.thumbnail} alt="" className="channel-thumb" style={{ width: '44px', height: '44px' }} />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm m-0 truncate flex items-center gap-1 font-bold">
              {channel.channelTitle}
              <a 
                href={channel.channelId ? `https://www.youtube.com/channel/${channel.channelId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.channelTitle)}`} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={12} className="text-muted opacity-60 hover:opacity-100" />
              </a>
            </h4>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {channel.growth24h > 10000 && <span className="badge badge-danger">🔥 급상승</span>}
              {channel.ratio > 2 && <span className="badge badge-success">📈 효율 고래</span>}
              {channel.isNew && <span className="badge badge-secondary">✨ 신규</span>}
              <span className="badge badge-warning" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', fontSize: '0.65rem' }}>
                {channel.category || '기타'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics & Growth */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-item">
          <span className="stat-label">구독자 / 주회비</span>
          <span className="stat-value">{formatNumber(channel.subscribers)}</span>
          <span className="text-xs text-muted mt-1 flex items-center gap-1">
            <Clock size={10} /> 주 {channel.uploadFrequency || 2}회 업로드
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">24h 조회수</span>
          <span className="stat-value text-success">+{formatNumber(channel.growth24h || 0)}</span>
          <div className="flex items-center gap-2 mt-1">
             <div style={{ width: '40px', height: '16px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                        <Line type="monotone" dataKey="v" stroke="var(--success)" strokeWidth={1.5} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
             <span className="stat-delta text-success" style={{ fontSize: '0.65rem' }}>+{channel.velocity || 0}%</span>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-label">Opportunity</span>
          <div className="flex items-center gap-2">
            <span className="stat-value" style={{ color: channel.opportunityScore > 70 ? 'var(--warning)' : 'white' }}>
                {channel.opportunityScore || 75}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
          </div>
          <span className="text-xs text-muted mt-1">성공 가능성</span>
        </div>
      </div>

      {/* 3. Content Strategy (Latest & Popular) */}
      <div className="flex items-center gap-6 justify-end" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-4">
          {/* Top Video */}
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-muted font-bold uppercase">인기 영상</span>
            <a 
              href={`https://www.youtube.com/watch?v=${channel.topVideoId || channel.id}`}
              target="_blank" 
              rel="noreferrer"
              className="relative w-24 aspect-video rounded overflow-hidden border border-border group/v1"
            >
              <img src={channel.topVideoThumbnail || channel.thumbnail} alt="" className="w-full h-full object-cover group-hover/v1:scale-105 transition-transform" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/v1:bg-black/40">
                <Play size={12} className="fill-white" />
              </div>
            </a>
          </div>
          {/* Latest Video */}
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] text-muted font-bold uppercase">최신 영상</span>
            <a 
              href={`https://www.youtube.com/watch?v=${channel.latestVideoId || channel.id}`}
              target="_blank" 
              rel="noreferrer"
              className="relative w-24 aspect-video rounded overflow-hidden border border-border group/v2"
            >
              <img src={channel.latestVideoThumbnail || channel.thumbnail} alt="" className="w-full h-full object-cover group-hover/v2:scale-105 transition-transform" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/v2:bg-black/40">
                <Calendar size={12} className="text-white" />
              </div>
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 ml-2">
            <button 
                className={`btn btn-secondary p-1.5 rounded-md ${isSaved ? 'text-primary bg-primary/10 border-primary/20' : ''}`}
                style={{ width: '32px', height: '32px' }}
                onClick={() => isSaved ? onRemove(channel.id) : onSave(channel)}
                title="저장하기"
            >
                <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button 
              className="btn btn-secondary p-1.5 rounded-md" 
              style={{ width: '32px', height: '32px' }}
              onClick={onClick}
              title="상세 분석"
            >
                <BarChart2 size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
