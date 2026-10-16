import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { INITIAL_TEXTS } from './data/texts';
import { TextItem, Grade, EssayPrompt } from './types';
import { Header } from './components/Header';
import { TableOfContents } from './components/TableOfContents';
import { ReadingView } from './components/ReadingView';
import { QuizSystem } from './components/QuizSystem';
import { GamesCenter } from './components/GamesCenter';
import { ExamCenter } from './components/ExamCenter';
import { ExamRoom } from './components/ExamRoom';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { AdminManageTextsModal } from './components/AdminManageTextsModal';
import { StudentWelcomeGate } from './components/StudentWelcomeGate';
import { RewardShopModal } from './components/RewardShopModal';
import { CustomCursor } from './components/CustomCursor';
import { 
  Bot, 
  BookOpen, 
  Sparkles, 
  Heart, 
  ExternalLink,
  GraduationCap,
  PenTool
} from 'lucide-react';

const STORAGE_KEY_CUSTOM_TEXTS = 'readmind_custom_texts';

function MainApp() {
  const { user } = useAuth();

  // Tab & Navigation State
  const [currentTab, setCurrentTab] = useState<'contents' | 'reading' | 'quiz' | 'games' | 'exam' | 'stats'>('contents');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(user?.grade || 8);
  const [activeExamPrompt, setActiveExamPrompt] = useState<EssayPrompt | null>(null);

  // Sync selectedGrade when user logs in with a specific grade
  useEffect(() => {
    if (user?.grade) {
      setSelectedGrade(user.grade);
    }
  }, [user?.grade]);

  // Texts library state (persists teacher additions in localStorage)
  const [texts, setTexts] = useState<TextItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_TEXTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const initialIds = new Set(INITIAL_TEXTS.map(t => t.id));
          const customOnly = parsed.filter((t: TextItem) => t && t.id && !initialIds.has(t.id));
          const list = [...customOnly, ...INITIAL_TEXTS];
          const seen = new Set<string>();
          return list.filter(t => {
            if (!t || !t.id || seen.has(t.id)) return false;
            seen.add(t.id);
            return true;
          });
        }
      }
    } catch {}
    return INITIAL_TEXTS;
  });

  const saveTexts = (newTexts: TextItem[]) => {
    setTexts(newTexts);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_TEXTS, JSON.stringify(newTexts));
    } catch {}
  };

  const handleAddText = (newText: TextItem) => {
    saveTexts([newText, ...texts]);
  };

  const handleDeleteText = (id: string) => {
    saveTexts(texts.filter(t => t.id !== id));
  };

  // Selected Text State
  const [selectedText, setSelectedText] = useState<TextItem>(texts[0]);
  const [readingInitialMode, setReadingInitialMode] = useState<'read' | 'voice' | 'quiz'>('read');

  // Modals & Assistant State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRewardShopOpen, setIsRewardShopOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);

  const handleSelectText = (text: TextItem, initialAction: 'read' | 'quiz' | 'voice' = 'read') => {
    setSelectedText(text);
    setReadingInitialMode(initialAction);
    setCurrentTab('reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAssistantForContext = (prompt: string) => {
    setAssistantPrompt(prompt);
    setIsAssistantOpen(true);
  };

  // If student is not logged in yet, immediately show the clean, distraction-free Welcome & Student Login Gate
  if (!user) {
    return (
      <>
        <CustomCursor />
        <StudentWelcomeGate
          onEnter={(g) => {
            setSelectedGrade(g);
            setCurrentTab('contents');
          }}
          onOpenDetailedAuth={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4FAFF] text-[#102A43]">
      {/* Modern Vibrant Custom Cursor */}
      <CustomCursor />

      {/* Top Main Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        openAuthModal={() => setIsAuthModalOpen(true)}
        openProfileModal={() => setIsProfileModalOpen(true)}
        openAIAssistant={() => {
          setAssistantPrompt(undefined);
          setIsAssistantOpen(true);
        }}
        openRewardShop={() => setIsRewardShopOpen(true)}
        hasSelectedText={!!selectedText}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {currentTab === 'contents' && (
          <TableOfContents
            texts={texts}
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            onSelectText={handleSelectText}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
          />
        )}

        {currentTab === 'reading' && selectedText && (
          <ReadingView
            text={selectedText}
            onBack={() => setCurrentTab('contents')}
            onGoToQuiz={() => {
              // Quiz is integrated in ReadingView, but keep compatibility
              setCurrentTab('reading');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAssistantForContext={handleOpenAssistantForContext}
            initialMode={readingInitialMode}
          />
        )}

        {currentTab === 'quiz' && selectedText && (
          <ReadingView
            text={selectedText}
            onBack={() => setCurrentTab('contents')}
            onGoToQuiz={() => {}}
            onOpenAssistantForContext={handleOpenAssistantForContext}
            initialMode="quiz"
          />
        )}

        {currentTab === 'games' && (
          <GamesCenter
            texts={texts.filter(t => t.grade === selectedGrade)}
            selectedText={selectedText}
            onSelectText={(t) => setSelectedText(t)}
            onOpenRewardShop={() => setIsRewardShopOpen(true)}
            onGoToReading={(t) => handleSelectText(t, 'read')}
          />
        )}

        {currentTab === 'exam' && (
          <ExamCenter
            selectedGrade={selectedGrade}
            setSelectedGrade={setSelectedGrade}
            onStartExam={(prompt) => {
              setActiveExamPrompt(prompt);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Focused Fullscreen Exam Room Modal / View */}
      {activeExamPrompt && (
        <ExamRoom
          prompt={activeExamPrompt}
          onExit={() => setActiveExamPrompt(null)}
        />
      )}

      {/* Floating AI Assistant Trigger Button (Bottom Right) */}
      <button
        onClick={() => {
          setAssistantPrompt(undefined);
          setIsAssistantOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#00A99D] to-[#008F85] text-white p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 border border-white/20 group cursor-pointer"
        title="Trò chuyện với Trợ lý ReadMind AI"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
          <Bot className="w-4 h-4" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold leading-none flex items-center space-x-1">
            <span>Trợ lý AI</span>
            <Sparkles className="w-3 h-3 text-[#FFF2B2]" />
          </p>
        </div>
      </button>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E0EBF4] py-6 px-4 text-xs text-[#61758A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-sm text-[#102A43] flex items-center justify-center md:justify-start space-x-1.5">
              <span>ReadMind AI</span>
              <span className="text-[#C3D9EB] font-normal">&bull;</span>
              <span className="text-[#00A99D] font-medium text-xs">Đọc để hiểu – Nghĩ để sâu – Học để trưởng thành</span>
            </p>
            <p className="text-[11px] text-[#61758A]">
              Ngữ liệu chuẩn Chương trình GDPT 2018 (SGK Kết nối tri thức với cuộc sống Lớp 6 - 9).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#61758A]">
            <a
              href="https://taphuan.nxbgd.vn/tap-huan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00A99D] hover:text-[#007F76] flex items-center space-x-1 hover:underline decoration-dotted"
            >
              <span>Tài liệu NXB Giáo dục</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-[#102A43] underline decoration-dotted cursor-pointer"
            >
              Quản lý Giáo viên
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-[#102A43] underline decoration-dotted cursor-pointer"
            >
              Hồ sơ học sinh
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenAuthForUpgrade={() => setIsAuthModalOpen(true)}
      />

      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeText={selectedText}
        initialPrompt={assistantPrompt}
      />

      <AdminManageTextsModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        texts={texts}
        onAddText={handleAddText}
        onDeleteText={handleDeleteText}
      />

      <RewardShopModal
        isOpen={isRewardShopOpen}
        onClose={() => setIsRewardShopOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
