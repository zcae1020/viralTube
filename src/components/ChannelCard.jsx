import React from 'react';
import { TrendingUp, Play, Bookmark, MoreVertical, Zap, ExternalLink, BarChart2 } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const ChannelCard = ({ channel, onSave, isSaved, onRemove, onClick }) => {
  // Use trend data from API or fallback to mock
  const trendData = channel.trend || [
    { v: 10 }, { v: 12 }, { v: 11 }, { v: 14 }, { v: 18 }, { v: 16 }, { v: 22 }
  ];

  const formatNumber = (num) => {
    if (num >= 100000000) return (num / 100000000).toFixed(1).replace('.0', '') + '억';
    if (num >= 10000) return (num / 10000).toFixed(1).replace('.0', '') + '만';
    return num?.toLocaleString();
  };

  const onCardClick = (e) => {
    // Prevent detailed view if clicking link/save buttons
    if (onClick) onClick();
  };

  return (
    <div className="card channel-card group" onClick={onCardClick}>
      {/* Left: Channel Info */}
      <div className="channel-info" onClick={(e) => e.stopPropagation()}>
        <a 
          href={channel.channelId ? `https://www.youtube.com/channel/${channel.channelId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(channel.channelTitle)}`} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity"
          onClick={() => {
            if (!channel.channelId) console.warn('Missing channelId for:', channel.channelTitle);
          }}
        >
          <img src={channel.thumbnail} alt="" className="channel-thumb" />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm m-0 truncate flex items-center gap-1">
              {channel.channelTitle}
              <ExternalLink size={12} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <span className="text-xs text-muted">채널 확인하기</span>
            <div className="flex gap-2 mt-2">
              <span className="badge badge-success">상승 중</span>
              {channel.ratio > 0.5 && <span className="badge badge-warning">바이럴</span>}
            </div>
          </div>
        </a>
      </div>

      {/* Middle: Stats & Trend */}
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">구독자</span>
          <span className="stat-value">{formatNumber(channel.subscribers)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">24h 조회수</span>
          <span className="stat-value text-success">+{formatNumber(channel.growth24h)}</span>
          <span className="stat-delta text-success">↑ {channel.velocity}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">7일 추세</span>
          <div style={{ width: '60px', height: '24px', marginTop: '4px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <Line 
                    type="monotone" 
                    dataKey="v" 
                    stroke="var(--success)" 
                    strokeWidth={2} 
                    dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-label">효율성</span>
          <span className="stat-value text-primary">{channel.ratio}x</span>
          <span className="text-xs text-muted">평균 대비</span>
        </div>
      </div>

      {/* Right: Content Preview */}
      <div className="flex items-center gap-4 justify-end">
        <div className="text-right">
          <span className="stat-label">조회수 1위</span>
          <div className="flex gap-2 mt-1">
             <a 
                href={`https://www.youtube.com/watch?v=${channel.id}`} 
                target="_blank" 
                rel="noreferrer"
                className="relative w-20 aspect-video rounded-md overflow-hidden border border-border group/video"
                onClick={(e) => e.stopPropagation()}
             >
                <img src={channel.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/40 transition-colors">
                    <Play size={14} className="fill-white" />
                </div>
             </a>
          </div>
        </div>
        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
            <button 
                className={`btn btn-secondary p-2 ${isSaved ? 'text-primary' : ''}`}
                onClick={() => isSaved ? onRemove(channel.id) : onSave(channel)}
            >
                <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
            <button className="btn btn-secondary p-2" onClick={onCardClick}>
                <BarChart2 size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
