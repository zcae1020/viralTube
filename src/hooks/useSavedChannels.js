import { useState, useEffect } from 'react';

export function useSavedChannels() {
  const [savedChannels, setSavedChannels] = useState(() => {
    const saved = localStorage.getItem('saved_channels');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('saved_channels', JSON.stringify(savedChannels));
  }, [savedChannels]);

  const saveChannel = (channel) => {
    if (!savedChannels.some(c => c.id === channel.id)) {
      setSavedChannels([...savedChannels, { ...channel, savedAt: new Date().toISOString(), notes: '' }]);
    }
  };

  const removeChannel = (id) => {
    setSavedChannels(savedChannels.filter(c => c.id !== id));
  };

  const updateNotes = (id, notes) => {
    setSavedChannels(savedChannels.map(c => 
      c.id === id ? { ...c, notes } : c
    ));
  };

  return { savedChannels, saveChannel, removeChannel, updateNotes };
}
