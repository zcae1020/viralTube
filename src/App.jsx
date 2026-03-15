import React, { useState, useEffect } from 'react';
import { Search, Youtube, TrendingUp, Filter, AlertCircle, Play, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function App() {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_YOUTUBE_API_KEY || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const fetchVideos = async (searchQuery) => {
    if (!searchQuery) return;
    if (!apiKey) {
      alert('실시간 데이터를 검색하려면 YouTube API Key가 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const searchRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: { part: 'snippet', q: searchQuery, maxResults: 15, type: 'video', key: apiKey }
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(keyword);
  };

  useEffect(() => {
    if (apiKey) {
      // 컴포넌트 마운트 시 기본적으로 보여줄 인기 컨텐츠 키워드 검색
      fetchVideos('코딩 브이로그');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {/* 추천/예시 기능 추가 */}
        <section className="px-6 mb-10">
          <div className="glass-morphism rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white relative z-10">
              <Star className="text-yellow-400 fill-yellow-400" size={24} /> 레전드 떡상 채널 / 키워드 탐색
            </h3>
            <p className="text-sm text-slate-400 mb-6 font-medium relative z-10">
              구독자 수 대비 역대급 조회수를 기록하는 채널이나 영상 검색어들을 클릭하여 직접 확인해보세요!
            </p>
            <div className="flex flex-wrap gap-3 relative z-10">
              {[
                { label: '"알고리즘의 선택" 🚀', query: '알고리즘의 선택' },
                { label: '첫 영상 떡상 사례 💥', query: '첫 영상 떡상' },
                { label: '구독자 10명, 조회수 100만 🤯', query: '구독자 10명 조회수 100만' },
                { label: '무명 유튜버 조회수 폭발 💎', query: '무명 유튜버 조회수 폭발' },
                { label: '역대급 쇼츠 떡상 📱', query: '쇼츠 떡상 레전드' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setKeyword(item.query);
                    fetchVideos(item.query);
                  }}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/20 transition-all duration-300 text-sm font-semibold border border-white/10 hover:border-yellow-400/50 flex items-center gap-2 text-slate-200 hover:text-white"
                >
                  <Search size={16} className="text-slate-400" /> {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 glass-morphism rounded-3xl mx-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="mb-6"
            >
              <TrendingUp size={48} className="text-red-500" />
            </motion.div>
            <p className="text-xl font-semibold mb-2 text-white">데이터를 분석 중입니다...</p>
            <p className="text-sm">잠시만 기다려주세요</p>
          </div>
        ) : videos.length > 0 ? (
          <>
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
                  className="glass-morphism rounded-2xl overflow-hidden card-hover"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden shrink-0">
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
                  <div className="p-5 pb-6 flex flex-col flex-1 text-left">
                    <h3 className="text-lg font-bold leading-tight mb-2" style={{ wordBreak: 'keep-all' }}>
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-400 font-semibold mb-4">
                      {video.channelTitle}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t-slate mt-auto">
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
          </>
        ) : (
          <div className="text-center text-slate-400 py-20 glass-morphism rounded-3xl mx-6">
            <Search className="mx-auto mb-4 opacity-50" size={48} />
            <p className="text-xl font-semibold mb-2">검색 결과가 없습니다</p>
            <p className="text-sm">위 검색창에서 궁금한 주제, 예를 들면 "제주도 브이로그" 같은 것들을 검색해보세요!</p>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t-slate py-10 text-center text-slate-500 text-sm">
        <p>&copy; 2024 ViralTube Ratio. 분석 도구</p>
      </footer>
    </div>
  );
}

export default App;
