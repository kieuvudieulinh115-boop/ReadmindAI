import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Grade } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Gamepad2, 
  User as UserIcon, 
  ExternalLink,
  ChevronDown,
  PenTool
} from 'lucide-react';
import { ChillAudioPlayer } from './ChillAudioPlayer';
import { createRipple } from '../utils/interactiveEffects';
import { AvatarWithFrame } from './AvatarWithFrame';

interface HeaderProps {
  currentTab: 'contents' | 'reading' | 'quiz' | 'games' | 'exam' | 'stats';
  setCurrentTab: (tab: 'contents' | 'reading' | 'quiz' | 'games' | 'exam' | 'stats') => void;
  selectedGrade: Grade;
  setSelectedGrade: (grade: Grade) => void;
  openAuthModal: () => void;
  openProfileModal: () => void;
  openAIAssistant: () => void;
  openRewardShop?: () => void;
  hasSelectedText?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedGrade,
  setSelectedGrade,
  openAuthModal,
  openProfileModal,
  openAIAssistant,
  openRewardShop
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E0EBF4] shadow-xs">
      {/* Top Mini Banner */}
      <div className="bg-[#F4FAFF] border-b border-[#E0EBF4] text-[#61758A] py-1 px-4 sm:px-8 text-[11px] font-medium flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00A99D]"></span>
          <span>Đọc để hiểu – Nghĩ để sâu – Học để trưởng thành</span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://taphuan.nxbgd.vn/tap-huan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#61758A] hover:text-[#00A99D] transition-colors underline decoration-dotted"
          >
            <span>Tài liệu, kết nối tri thức (NXB Giáo dục)</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
          <span className="text-[#D0E0EE]">•</span>
          <span className="text-[#C07D2B] font-semibold">Chương trình GDPT 2018</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[68px]">
          {/* Logo & Brand (Matching Hình 2) */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={(e) => {
              createRipple(e);
              setCurrentTab('contents');
            }}
          >
            {/* Vibrant Teal Open Book Icon */}
            <div className="w-10 h-10 rounded-2xl bg-[#E0F8F3] text-[#00A99D] flex items-center justify-center shadow-xs group-hover:bg-[#00A99D] group-hover:text-white transition-all">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif-academic font-bold text-lg sm:text-xl tracking-tight text-[#102A43]">
                  ReadMind AI
                </span>
              </div>
              <p className="text-[11px] text-[#61758A] -mt-0.5 hidden sm:block font-medium">
                Nền tảng đọc hiểu Ngữ văn THCS
              </p>
            </div>
          </div>

          {/* Grade Selector Pills (Matching Hình 2: Khối lớp: Lớp 6, Lớp 7, Lớp 8, Lớp 9) */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#F4FAFF] px-2.5 py-1.5 rounded-2xl border border-[#E0EBF4]">
            <span className="text-xs font-semibold text-[#61758A] pr-1">Khối lớp:</span>
            {([6, 7, 8, 9] as Grade[]).map((g) => {
              const isActive = selectedGrade === g;
              return (
                <button
                  key={g}
                  onClick={(e) => {
                    createRipple(e);
                    setSelectedGrade(g);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ripple-container cursor-pointer ${
                    isActive
                      ? 'bg-[#00A99D] text-white shadow-xs'
                      : 'bg-[#EAF6FF] text-[#3285E8] hover:bg-[#D9EFFF]'
                  }`}
                >
                  Lớp {g}
                </button>
              );
            })}
          </div>

          {/* Navigation Links (Matching Hình 2 - Removed redundant separate "Bài đọc" / "Câu hỏi đọc hiểu" tabs) */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {/* Tủ sách (Home/Bookshelf) */}
            <button
              onClick={(e) => {
                createRipple(e);
                setCurrentTab('contents');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ripple-container cursor-pointer ${
                currentTab === 'contents'
                  ? 'bg-[#00A99D] text-white shadow-xs'
                  : 'text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Tủ sách</span>
            </button>

            {/* Ôn thi Ngữ văn */}
            <button
              onClick={(e) => {
                createRipple(e);
                setCurrentTab('exam');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ripple-container cursor-pointer ${
                currentTab === 'exam'
                  ? 'bg-[#00A99D] text-white shadow-xs'
                  : 'text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF]'
              }`}
            >
              <PenTool className="w-4 h-4 text-[#3285E8]" />
              <span>Ôn thi</span>
            </button>

            {/* Trò chơi */}
            <button
              onClick={(e) => {
                createRipple(e);
                setCurrentTab('games');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ripple-container cursor-pointer ${
                currentTab === 'games'
                  ? 'bg-[#00A99D] text-white shadow-xs'
                  : 'text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF]'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-[#F2B544]" />
              <span className="hidden sm:inline">Trò chơi</span>
            </button>


            {/* AI Assistant Button (Golden Yellow Pill as in Hình 2) */}
            <button
              onClick={(e) => {
                createRipple(e);
                openAIAssistant();
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-[#FFF2B2] hover:bg-[#FFE885] text-[#8C5E00] border border-[#F5D76E] shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C07D2B]" />
              <span>Trợ lý AI</span>
            </button>

            {/* Chill Audio Button (Matching Hình 2) */}
            <ChillAudioPlayer />

            {/* User Profile / Auth Area */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-[#E0EBF4]">
                {/* Coins Badge (e.g. 🪙 80 Xu) */}
                <button
                  onClick={(e) => {
                    createRipple(e);
                    openRewardShop?.();
                  }}
                  className="flex items-center space-x-1 bg-[#FFF8E7] hover:bg-[#FFF1D0] text-[#C07D2B] px-2.5 py-1 rounded-xl text-xs font-bold border border-[#FCE1A8] shadow-2xs transition-all cursor-pointer ripple-container"
                  title="Ví Xu của em - Vào Cửa hàng Tri thức"
                >
                  <span className="text-xs">🪙</span>
                  <span>{user.coins ?? 80} Xu</span>
                </button>

                {/* Avatar & User Name (with equipped frame support) */}
                <button
                  onClick={(e) => {
                    createRipple(e);
                    openProfileModal();
                  }}
                  className="flex items-center space-x-1.5 p-1 rounded-xl hover:bg-[#EAF6FF] transition-colors border border-transparent hover:border-[#E0EBF4] cursor-pointer"
                >
                  <AvatarWithFrame
                    avatar={user.avatar || '🦉'}
                    frameId={user.equippedFrameId}
                    size="sm"
                  />
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-[#102A43] leading-tight truncate max-w-[90px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-[#61758A] font-medium">
                      Lớp {user.grade}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#61758A]" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  createRipple(e);
                  openAuthModal();
                }}
                className="btn-primary-teal ripple-container px-3.5 py-1.5 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Grade Selector Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#F4FAFF] border-t border-[#E0EBF4] text-xs">
        <span className="font-semibold text-[#61758A]">Khối lớp:</span>
        <div className="flex space-x-1">
          {([6, 7, 8, 9] as Grade[]).map((g) => (
            <button
              key={g}
              onClick={(e) => {
                createRipple(e);
                setSelectedGrade(g);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                selectedGrade === g
                  ? 'bg-[#00A99D] text-white shadow-xs'
                  : 'bg-white text-[#3285E8] border border-[#E0EBF4]'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
