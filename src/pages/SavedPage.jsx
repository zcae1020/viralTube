import React from 'react';
import { Bookmark, FolderPlus } from 'lucide-react';
import { useSavedChannels } from '../hooks/useSavedChannels';
import ChannelCard from '../components/ChannelCard';

const SavedPage = () => {
  const { savedChannels, saveChannel, removeChannel } = useSavedChannels();

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl mb-2">성장 노트</h1>
            <p className="text-secondary">벤치마킹 및 전략 수립을 위해 저장한 채널들입니다.</p>
        </div>
        <button className="btn btn-primary">
            <FolderPlus size={18} />
            <span>새 폴더 추가</span>
        </button>
      </div>

      {savedChannels.length > 0 ? (
        <div className="channel-list p-0">
          <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-xs text-muted font-bold uppercase">{savedChannels.length}개의 채널이 저장됨</span>
          </div>
          {savedChannels.map((channel, i) => (
            <div key={channel.id} className="relative group">
              <ChannelCard 
                channel={channel} 
                onSave={saveChannel}
                onRemove={removeChannel}
                isSaved={true}
              />
              {channel.notes && (
                <div className="mt-2 p-3 bg-sidebar rounded-lg border border-border text-xs text-muted">
                  <strong>노트:</strong> {channel.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border rounded-2xl bg-sidebar">
          <Bookmark size={48} className="text-muted mb-4 opacity-30" />
          <h3 className="mb-2">워크스페이스가 비어있습니다</h3>
          <p className="text-muted max-w-sm text-center">채널 파인더에서 마음에 드는 채널을 저장하여 나만의 콘텐츠 전략 라이브러리를 구축해보세요.</p>
          <button className="btn btn-secondary mt-6" onClick={() => window.location.href='/explore'}>채널 찾으러 가기</button>
        </div>
      )}
    </div>
  );
};

export default SavedPage;
