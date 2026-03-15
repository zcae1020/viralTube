import React, { useState, useEffect } from 'react';
import { Search, Youtube, TrendingUp, Filter, AlertCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Mock data for demonstration
const MOCK_VIDEOS = [
  {
    id: '1',
    title: 'How I Built a Rocket in my Basement',
    thumbnail: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80',
    channelTitle: 'Basement Engineer',
    views: 1200000,
    subscribers: 5000,
    ratio: 240,
    publishedAt: '2024-03-10'
  },
  {
    id: '2',
    title: '10 Secrets of the Deep Ocean',
    thumbnail: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80',
    channelTitle: 'Nature Insider',
    views: 850000,
    subscribers: 25000,
    ratio: 34,
    publishedAt: '2024-03-12'
  },
  {
    id: '3',
    title: 'World\'s Smallest Computer Teardown',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    channelTitle: 'TechNano',
    views: 2500000,
    subscribers: 15000,
    ratio: 166,
    publishedAt: '2024-03-11'
  },
  {
    id: '4',
    title: 'Hiking Across the Sahara Desert Alone',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5edd0ea9?w=800&q=80',
    channelTitle: 'Adventure Seeker',
    views: 3200000,
    subscribers: 80000,
    ratio: 40,
    publishedAt: '2024-03-09'
  },
  {
    id: '5',
    title: 'The Math Behind Winning Every Time',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    channelTitle: 'Logic Wizard',
    views: 450000,
    subscribers: 1200,
    ratio: 375,
    publishedAt: '2024-03-13'
  }
];

function App() {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState(MOCK_VIDEOS);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_YOUTUBE_API_KEY || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!keyword) return;
    if (!apiKey) {
      alert('실시간 데이터를 검색하려면 YouTube API Key가 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: { part: 'snippet', q: keyword, maxResults: 15, type: 'video', key: apiKey }
      });

      const videoIds = searchRes.data.items.map(item => item.id.videoId).join(',');
      const channelIds = [...new Set(searchRes.data.items.map(item => item.snippet.channelId))].join(',');

      const videoRes = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: { part: 'statistics', id: videoIds, key: apiKey }
      });
      const channelRes = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: { part: 'statistics', id: channelIds, key: apiKey }
      });

      const channelMap = {};
      channelRes.data.items.forEach(c => { channelMap[c.id] = parseInt(c.statistics.subscriberCount); });

      const statsMap = {};
      videoRes.data.items.forEach(v => { statsMap[v.id] = parseInt(v.statistics.viewCount); });

      const enrichedVideos = searchRes.data.items.map(item => {
        const views = statsMap[item.id.videoId] || 0;
        const subs = channelMap[item.snippet.channelId] || 1;
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle,
          views,
          subscribers: subs,
          ratio: parseFloat((views / subs).toFixed(2)),
          publishedAt: item.snippet.publishedAt
        };
      }).sort((a, b) => b.ratio - a.ratio);

      setVideos(enrichedVideos);
    } catch (error) {
      console.error('Error:', error);
      alert('데이터를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="logo-container"
        >
          <img src="/logo.png" alt="ViralTube Logo" className="logo-image" />
        </motion.div>
        
        <p className="text-slate-400 max-w-xl mx-auto mb-8 font-medium">
          구독자 수 대비 조회수가 압도적인 '떡상' 영상들을 한눈에 확인하세요.<br/>
          성장 잠재력이 높은 채널을 찾는 가장 빠른 방법입니다.
        </p>

        {/* Search */}
        <div className="search-container">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="search-input-wrapper">
              <Search className="icon-left" size={20} />
              <input
                type="text"
                className="input-field input-with-icon"
                placeholder="관심 주제를 검색해보세요 (예: AI, 여행, 요리...)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              {loading ? '검색 중...' : <><TrendingUp size={20} /> 분석하기</>}
            </button>
          </form>
        </div>

        <button 
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 mx-auto mb-12"
        >
          <AlertCircle size={14} /> {showKeyInput ? '설정 닫기' : 'YouTube API Key 등록 (데이터 검색용)'}
        </button>

        <AnimatePresence>
          {showKeyInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto mb-12 overflow-hidden"
            >
              <div className="p-4 glass-morphism rounded-2xl text-left">
                <label className="text-sm font-semibold mb-2 flex text-slate-300">API Key</label>
                <input
                  type="password"
                  className="input-field mb-2"
                  placeholder="API 키를 입력하세요..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-6 mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-red-500" /> 분석 결과
          </h2>
        </div>

        <div className="grid-container">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-morphism rounded-3xl overflow-hidden card-hover"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full card-img-hover transition-transform duration-500"
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 overlay-gradient flex items-end p-4">
                  <div className="badge badge-viral flex items-center gap-1">
                    <TrendingUp size={12} /> {video.ratio}x 파급력
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-slate-400 font-semibold mb-4">
                  {video.channelTitle}
                </p>

                <div className="flex items-center justify-between pt-4 border-t-slate">
                  <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Views</div>
                    <div className="text-sm font-bold">{formatNumber(video.views)}</div>
                  </div>
                  <div className="stats-divider"></div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Subs</div>
                    <div className="text-sm font-bold">{formatNumber(video.subscribers)}</div>
                  </div>
                  <div className="stats-divider"></div>
                  <div className="text-center">
                    <div className="text-xs text-slate-500 uppercase font-bold mb-1">Ratio</div>
                    <div className="text-sm font-bold text-red-500">{video.ratio}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="mt-20 border-t-slate py-10 text-center text-slate-500 text-sm">
        <p>&copy; 2024 ViralTube Ratio. 분석 도구</p>
      </footer>
    </div>
  );
}

export default App;
