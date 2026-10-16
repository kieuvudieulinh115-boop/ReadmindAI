import React, { useState, useEffect } from 'react';
import { chillAudio } from '../utils/chillAudio';
import { Music, Volume2, VolumeX, Sparkles, CloudRain, Wind, Disc } from 'lucide-react';

export const ChillAudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'lofi' | 'rain' | 'chime'>('lofi');
  const [volume, setVolume] = useState(35);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    return () => {
      chillAudio.stop();
    };
  }, []);

  const handleToggle = () => {
    const active = chillAudio.toggle(mode);
    setIsPlaying(active);
  };

  const handleChangeMode = (newMode: 'lofi' | 'rain' | 'chime') => {
    setMode(newMode);
    if (isPlaying) {
      chillAudio.start(newMode);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    chillAudio.setVolume(val / 100);
  };

  return (
    <div className="relative">
      {/* Floating Chill Music Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
          isPlaying
            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-300 animate-pulse'
            : 'bg-white/90 text-slate-700 hover:bg-white hover:text-blue-700 border border-slate-200'
        }`}
        title="Bật nhạc chill chill nhẹ nhàng khi học"
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-yellow-200' : 'text-slate-400'}`} />
        <span>{isPlaying ? 'Nhạc Chill Đang Phát' : 'Âm thanh Chill'}</span>
      </button>

      {/* Control Panel Dropdown */}
      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 z-50 animate-in fade-in zoom-in-95 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <Disc className={`w-4 h-4 text-emerald-600 ${isPlaying ? 'animate-spin' : ''}`} />
              <span className="text-xs font-extrabold text-slate-800">Không Gian Âm Nhạc Chill</span>
            </div>
            <button
              onClick={() => setShowPanel(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Giai điệu piano lofi và âm thanh thiên nhiên êm dịu giúp học sinh tập trung đọc hiểu và thư thái tâm hồn.
          </p>

          {/* 3 Sound Themes */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-bold">
            <button
              onClick={() => handleChangeMode('lofi')}
              className={`p-2 rounded-xl border flex flex-col items-center space-y-1 transition-all ${
                mode === 'lofi'
                  ? 'bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Piano Lofi</span>
            </button>

            <button
              onClick={() => handleChangeMode('rain')}
              className={`p-2 rounded-xl border flex flex-col items-center space-y-1 transition-all ${
                mode === 'rain'
                  ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CloudRain className="w-4 h-4 text-teal-500" />
              <span>Mưa Êm Đềm</span>
            </button>

            <button
              onClick={() => handleChangeMode('chime')}
              className={`p-2 rounded-xl border flex flex-col items-center space-y-1 transition-all ${
                mode === 'chime'
                  ? 'bg-purple-50 border-purple-500 text-purple-800 ring-1 ring-purple-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Wind className="w-4 h-4 text-indigo-500" />
              <span>Chuông Gió</span>
            </button>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={handleToggle}
            className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Tạm dừng nhạc chill</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Phát nhạc thư giãn ngay</span>
              </>
            )}
          </button>

          {/* Volume slider */}
          <div className="flex items-center space-x-2 pt-1 text-slate-500">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-bold w-6 text-right">{volume}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
