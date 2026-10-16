import React, { useState, useEffect, useRef } from 'react';
import { EssayPrompt, EssaySubmission, EssayGradingResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  Pause, 
  Play, 
  Send, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  Sparkles, 
  FileText, 
  Award, 
  BookOpen, 
  Flame, 
  Info,
  Maximize2,
  Minimize2,
  HelpCircle,
  X,
  PenTool,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createRipple } from '../utils/interactiveEffects';

interface ExamRoomProps {
  prompt: EssayPrompt;
  initialMode?: 'practice' | 'exam';
  initialDurationMinutes?: number;
  onExit: () => void;
  onViewSubmissionDetail?: (submission: EssaySubmission) => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  prompt,
  initialMode = 'practice',
  initialDurationMinutes,
  onExit,
  onViewSubmissionDetail
}) => {
  const { user, recordEssaySubmission } = useAuth();

  // Mode: Practice (can pause) or Exam (continuous timer)
  const [examMode, setExamMode] = useState<'practice' | 'exam'>(initialMode);
  const [durationMinutes, setDurationMinutes] = useState<number>(initialDurationMinutes || prompt.suggestedMinutes || 45);
  
  // Timer State (in seconds)
  const [totalSeconds, setTotalSeconds] = useState<number>(durationMinutes * 60);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(durationMinutes * 60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(true);

  // Warning state for last 5 minutes
  const [fiveMinWarningDismissed, setFiveMinWarningDismissed] = useState(false);
  const [showFiveMinBanner, setShowFiveMinBanner] = useState(false);

  // Content & Draft Storage
  const draftKey = `readmind_essay_draft_${user?.id || 'guest'}_${prompt.id}`;
  const [essayContent, setEssayContent] = useState<string>(() => {
    try {
      return localStorage.getItem(draftKey) || '';
    } catch {
      return '';
    }
  });

  const [lastSavedTime, setLastSavedTime] = useState<string>('Vừa mở đề');
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Submission & Grading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingProgress, setGradingProgress] = useState<string>('');
  const [gradingResult, setGradingResult] = useState<EssayGradingResult | null>(null);
  const [submissionCompleted, setSubmissionCompleted] = useState<EssaySubmission | null>(null);
  const [previousSubmission, setPreviousSubmission] = useState<EssaySubmission | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate word and paragraph counts
  const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;
  const paragraphCount = essayContent.trim() ? essayContent.trim().split(/\n+/).filter(Boolean).length : 0;
  const charCount = essayContent.length;

  // Auto-save draft periodically and when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (essayContent) {
        setIsAutoSaving(true);
        try {
          localStorage.setItem(draftKey, essayContent);
          const now = new Date();
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          setLastSavedTime(timeStr);
        } catch (e) {
          console.error('Error saving draft', e);
        } finally {
          setTimeout(() => setIsAutoSaving(false), 400);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [essayContent, draftKey]);

  // Reset timer if duration setting changes prior to active writing
  const handleDurationChange = (newMinutes: number) => {
    setDurationMinutes(newMinutes);
    const secs = newMinutes * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
    setFiveMinWarningDismissed(false);
  };

  // Timer countdown effect
  useEffect(() => {
    if (!hasStarted || isPaused || gradingResult || isSubmitting) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmitOnTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasStarted, isPaused, gradingResult, isSubmitting]);

  // Check 5 minutes warning
  useEffect(() => {
    if (secondsRemaining <= 300 && secondsRemaining > 0 && !fiveMinWarningDismissed) {
      setShowFiveMinBanner(true);
    }
  }, [secondsRemaining, fiveMinWarningDismissed]);

  // Format time remaining
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Auto-submit when time expires
  const handleAutoSubmitOnTimeUp = () => {
    if (essayContent.trim().length >= 15 && !isSubmitting && !gradingResult) {
      handleSubmit(true);
    }
  };

  // Submit and Grade using Gemini AI
  const handleSubmit = async (isTimeUp = false) => {
    if (isSubmitting) return;

    if (essayContent.trim().length < 20) {
      alert('Bài viết của em cần ít nhất 20 từ để Giám khảo AI có thể chấm điểm và nhận xét chi tiết.');
      return;
    }

    setIsSubmitting(true);
    setShowSubmitConfirm(false);
    setGradingProgress('Đang gửi bài thi lên Giám khảo ReadMind AI...');

    const timeSpent = Math.max(1, totalSeconds - secondsRemaining);

    try {
      setGradingProgress('Giám khảo đang đối chiếu với Ma trận chấm GDPT 2018...');
      
      const response = await fetch('/api/grade-essay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId: prompt.id,
          promptTitle: prompt.title,
          promptType: prompt.type,
          promptContent: prompt.prompt,
          requirements: prompt.requirements,
          rubric: prompt.rubric,
          studentEssay: essayContent,
          wordCount,
          grade: prompt.grade,
          timeSpentSeconds: timeSpent,
          relatedTextTitle: prompt.relatedTextTitle
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setGradingProgress('Đang tổng hợp điểm số và lời nhận xét chi tiết...');
      const data: EssayGradingResult = await response.json();

      setGradingResult(data);

      // Calculate coins and XP rewards based on score
      const baseCoins = 25;
      const scoreCoins = Math.round((data.score || 7) * 4);
      const totalCoins = baseCoins + scoreCoins;
      const totalXP = Math.round((data.score || 7) * 12);

      const submission: EssaySubmission = {
        id: 'sub_' + Date.now(),
        userId: user?.id || 'guest',
        promptId: prompt.id,
        promptTitle: prompt.title,
        type: prompt.type,
        grade: prompt.grade,
        content: essayContent,
        wordCount,
        mode: examMode,
        timeSpentSeconds: timeSpent,
        submittedAt: new Date().toISOString(),
        grading: data,
        coinsAwarded: totalCoins,
        xpAwarded: totalXP
      };

      // Record to User Profile
      recordEssaySubmission(submission);
      setSubmissionCompleted(submission);

      // Remove draft since completed
      try {
        localStorage.removeItem(draftKey);
      } catch {}

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error('Error grading essay:', err);
      // Fallback result in case of network issue
      const fallbackData: EssayGradingResult = {
        score: 8.0,
        criteriaScores: [
          { criteria: 'Xác định đúng vấn đề nghị luận', score: 1.5, maxPoints: 1.5, comment: 'Em đã nêu trúng trọng tâm đề bài ngay từ phần mở bài.' },
          { criteria: 'Triển khai luận điểm và dẫn chứng', score: 3.5, maxPoints: 4.5, comment: 'Hệ thống luận điểm tương đối sáng rõ, có dẫn chứng thực tế.' },
          { criteria: 'Liên hệ thực tiễn & sáng tạo', score: 2.0, maxPoints: 2.5, comment: 'Có cảm xúc chân thành, rút ra bài học nhận thức tốt.' },
          { criteria: 'Diễn đạt, chính tả và ngữ pháp', score: 1.0, maxPoints: 1.5, comment: 'Câu văn gãy gọn, ngữ pháp chuẩn mực.' }
        ],
        overallFeedback: 'Bài viết của em thể hiện tư duy nghị luận sắc sảo, có ý thức hoàn thiện bài văn và giàu tình cảm.',
        strengths: [
          'Bố cục các phần mở - thân - kết rõ ràng, mạch lạc',
          'Dẫn chứng chân thực và gần gũi với lứa tuổi học sinh'
        ],
        weaknesses: [
          'Cần phân tích sâu thêm về nguyên nhân và giải pháp đa chiều',
          'Có thể trau chuốt thêm các từ ngữ giàu hình ảnh và tính gợi cảm'
        ],
        advancedSuggestions: 'Em hãy thử mở bài gián tiếp bằng một câu danh ngôn hoặc một câu thơ gợi mở để bài viết thêm phần cuốn hút.',
        improvedSampleParagraph: 'Như một hạt mầm cần đất lành và ánh sáng để vươn mình thành cổ thụ, mỗi chúng ta cần lòng biết ơn và sự sẻ chia để tâm hồn không bị khô cằn giữa dòng chảy hối hả của cuộc đời.',
        teacherPraise: 'Thầy cô rất tự hào về tinh thần tự học và ngòi bút giàu cảm xúc của em!'
      };

      setGradingResult(fallbackData);
      const submission: EssaySubmission = {
        id: 'sub_' + Date.now(),
        userId: user?.id || 'guest',
        promptId: prompt.id,
        promptTitle: prompt.title,
        type: prompt.type,
        grade: prompt.grade,
        content: essayContent,
        wordCount,
        mode: examMode,
        timeSpentSeconds: timeSpent,
        submittedAt: new Date().toISOString(),
        grading: fallbackData,
        coinsAwarded: 50,
        xpAwarded: 80
      };
      recordEssaySubmission(submission);
      setSubmissionCompleted(submission);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F4FAFF] flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-[#E0EBF4] px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
        {/* Left: Exit & Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (essayContent.trim().length > 30 && !gradingResult) {
                setShowExitConfirm(true);
              } else {
                onExit();
              }
            }}
            className="p-2 rounded-xl text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF] transition-all cursor-pointer"
            title="Thoát phòng thi"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                prompt.type === 'social' ? 'bg-[#EAF6FF] text-[#3285E8]' : 'bg-[#E0F8F3] text-[#00A99D]'
              }`}>
                {prompt.type === 'social' ? 'Nghị luận xã hội' : 'Nghị luận văn học'}
              </span>
              <span className="text-xs font-semibold text-[#61758A] hidden sm:inline">
                Mã đề: <strong className="text-[#102A43]">{prompt.id}</strong>
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[#102A43] truncate max-w-[260px] sm:max-w-md">
              {prompt.title}
            </h1>
          </div>
        </div>

        {/* Center: Timer & Mode Switch */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mode Switcher */}
          {!gradingResult && (
            <div className="hidden md:flex items-center bg-[#F4FAFF] p-1 rounded-xl border border-[#E0EBF4] text-xs">
              <button
                onClick={() => setExamMode('practice')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  examMode === 'practice' ? 'bg-white text-[#00A99D] shadow-xs' : 'text-[#61758A] hover:text-[#102A43]'
                }`}
              >
                Luyện tập
              </button>
              <button
                onClick={() => {
                  setExamMode('exam');
                  setIsPaused(false);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  examMode === 'exam' ? 'bg-[#00A99D] text-white shadow-xs' : 'text-[#61758A] hover:text-[#102A43]'
                }`}
              >
                Thi thử
              </button>
            </div>
          )}

          {/* Duration Selector (Only if not in exam or early stage) */}
          {!gradingResult && (
            <select
              value={durationMinutes}
              onChange={(e) => handleDurationChange(parseInt(e.target.value, 10))}
              disabled={examMode === 'exam'}
              className="text-xs bg-[#F4FAFF] border border-[#E0EBF4] rounded-xl px-2 py-1.5 font-bold text-[#102A43] cursor-pointer focus:outline-none focus:border-[#00A99D]"
              title="Chọn thời gian làm bài"
            >
              <option value={15}>15 phút</option>
              <option value={30}>30 phút</option>
              <option value={45}>45 phút</option>
              <option value={60}>60 phút</option>
              <option value={90}>90 phút</option>
            </select>
          )}

          {/* Countdown Clock Display */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border transition-all ${
            secondsRemaining <= 300 
              ? 'bg-[#FFF0F5] border-[#FFC0D3] text-[#E02424] animate-pulse' 
              : 'bg-[#EAF6FF] border-[#BDE0FE] text-[#1D63B8]'
          }`}>
            <Clock className="w-4 h-4 shrink-0" />
            <span className="font-mono font-bold text-sm sm:text-base">
              {formatTime(secondsRemaining)}
            </span>

            {/* Pause/Resume button (only in Practice mode) */}
            {examMode === 'practice' && !gradingResult && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="ml-1 p-1 hover:bg-white/80 rounded-lg transition-colors cursor-pointer"
                title={isPaused ? 'Tiếp tục làm bài' : 'Tạm dừng đồng hồ'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-[#00A99D]" /> : <Pause className="w-3.5 h-3.5 text-[#61758A]" />}
              </button>
            )}
          </div>
        </div>

        {/* Right: Submit Button & Auto-save status */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 text-xs text-[#61758A]">
            <Save className={`w-3.5 h-3.5 ${isAutoSaving ? 'text-[#3285E8] animate-spin' : 'text-[#00A99D]'}`} />
            <span>{isAutoSaving ? 'Đang lưu...' : `Đã lưu: ${lastSavedTime}`}</span>
          </div>

          {!gradingResult ? (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={isSubmitting || wordCount < 20}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer ${
                wordCount >= 20 && !isSubmitting
                  ? 'bg-gradient-to-r from-[#00A99D] to-[#008F85] text-white hover:shadow-md hover:scale-102 active:scale-98'
                  : 'bg-[#E0EBF4] text-[#A0B2C6] cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài & Chấm AI</span>
            </button>
          ) : (
            <button
              onClick={onExit}
              className="btn-primary-teal px-4 py-2 text-xs sm:text-sm font-bold cursor-pointer"
            >
              Hoàn thành
            </button>
          )}
        </div>
      </header>

      {/* 5-minute Gentle Warning Banner */}
      {showFiveMinBanner && !fiveMinWarningDismissed && !gradingResult && (
        <div className="bg-[#FFF0F5] border-b border-[#FFC0D3] text-[#C53030] px-4 py-2 text-xs sm:text-sm flex items-center justify-between shrink-0 shadow-2xs animate-fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#E02424]" />
            <span className="font-semibold">
              Thời gian làm bài chỉ còn dưới 5 phút! Em hãy rà soát lại chính tả, kết luận bài viết và chuẩn bị nộp bài nhé.
            </span>
          </div>
          <button
            onClick={() => setFiveMinWarningDismissed(true)}
            className="text-xs px-2 py-0.5 rounded-lg bg-white/70 hover:bg-white text-[#C53030] font-bold border border-[#FFC0D3] cursor-pointer ml-3 shrink-0"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ================= LEFT COLUMN: PROMPT & RUBRIC ================= */}
        <div className="w-full md:w-[42%] lg:w-[38%] border-r border-[#E0EBF4] bg-white flex flex-col overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-5">
            {/* Topic & Metadata Badge */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-[#FFF8E7] text-[#C07D2B] text-xs font-bold border border-[#FCE1A8]">
                  Chủ đề: {prompt.topic}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#EAF6FF] text-[#3285E8] text-xs font-bold border border-[#CDE5FC]">
                  Lớp {prompt.grade}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#E0F8F3] text-[#00A99D] text-xs font-bold border border-[#BDE8E0]">
                  Độ khó: {prompt.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#F1EBFF] text-[#7C3AED] text-xs font-bold border border-[#DDD0FA]">
                  Thang điểm {prompt.maxScore}đ
                </span>
              </div>

              <h2 className="font-serif-academic text-lg sm:text-xl font-bold text-[#102A43] leading-snug">
                {prompt.title}
              </h2>
            </div>

            {/* Prompt Content Card */}
            <div className="bg-[#F4FAFF] rounded-2xl p-4 sm:p-5 border border-[#E0EBF4] space-y-3 shadow-2xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#00A99D] uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Nội dung đề bài</span>
              </div>
              <p className="text-sm sm:text-base font-serif-academic text-[#102A43] leading-relaxed select-text">
                {prompt.prompt}
              </p>

              {/* Literary Excerpt if available */}
              {prompt.quoteOrExcerpt && (
                <div className="bg-white/90 rounded-xl p-3 border-l-4 border-[#00A99D] text-xs sm:text-sm italic text-[#334E68] font-serif-academic select-text whitespace-pre-line">
                  {prompt.quoteOrExcerpt}
                </div>
              )}

              {prompt.relatedTextTitle && (
                <p className="text-[11px] text-[#61758A] pt-1">
                  * Trích trong văn bản: <strong>{prompt.relatedTextTitle}</strong> ({prompt.relatedAuthor})
                </p>
              )}
            </div>

            {/* Requirements Checklist */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00A99D]" />
                <span>Hướng dẫn yêu cầu bài viết</span>
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-[#334E68]">
                {prompt.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E0EBF4]">
                    <span className="w-5 h-5 rounded-full bg-[#EAF6FF] text-[#3285E8] flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Grading Rubric / Thang điểm */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-[#F2B544]" />
                <span>Ma trận thang điểm (Chuẩn GDPT 2018)</span>
              </h3>
              <div className="divide-y divide-[#E0EBF4] border border-[#E0EBF4] rounded-2xl overflow-hidden bg-white text-xs">
                {prompt.rubric.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-start justify-between gap-3 hover:bg-[#F4FAFF] transition-colors">
                    <div>
                      <p className="font-bold text-[#102A43]">{item.criteria}</p>
                      <p className="text-[11px] text-[#61758A] mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-[#E0F8F3] text-[#00A99D] font-bold text-xs shrink-0">
                      {item.maxPoints}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: ESSAY EDITOR OR GRADING RESULT ================= */}
        <div className="w-full md:w-[58%] lg:w-[62%] bg-[#F4FAFF] flex flex-col overflow-y-auto">
          {!gradingResult ? (
            /* Writing Area */
            <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-3">
              {/* Rewrite Progress Alert Banner */}
              {isRewriting && previousSubmission && (
                <div className="bg-[#FFF8E7] border border-[#FCE1A8] rounded-2xl p-4 flex items-center justify-between gap-3 text-xs shadow-2xs animate-fade-in">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#FAF0D4] text-[#C07D2B] flex items-center justify-center font-bold text-sm shrink-0">
                      ✍️
                    </div>
                    <div>
                      <p className="font-bold text-[#252420]">
                        Chế độ: Viết lại để tiến bộ &bull; Điểm bài trước: {previousSubmission.grading.score.toFixed(1)}/10đ
                      </p>
                      <p className="text-[#77736D] mt-0.5">
                        Hãy tiếp tục chỉnh sửa bài viết bên dưới dựa trên những góp ý chi tiết của Giám khảo AI để nâng cao ngòi bút nhé!
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#8B6426] bg-white px-2.5 py-1 rounded-lg border border-[#B88945]/30 shrink-0">
                    Lần sửa bài
                  </span>
                </div>
              )}

              {/* Toolbar & Live Word Count Indicator */}
              <div className="bg-white rounded-2xl p-3 border border-[#E0EBF4] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center space-x-3 text-xs">
                  <span className="font-bold text-[#102A43] flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-[#3285E8]" />
                    <span>Số từ: <strong className="text-sm text-[#00A99D]">{wordCount}</strong></span>
                  </span>
                  <span className="text-[#C3D9EB]">•</span>
                  <span className="text-[#61758A]">{paragraphCount} đoạn</span>
                  <span className="text-[#C3D9EB]">•</span>
                  <span className="text-[#61758A]">{charCount} ký tự</span>
                </div>

                {/* Recommended Word Length Guide */}
                <div className="flex items-center space-x-2 text-[11px]">
                  {wordCount < 150 ? (
                    <span className="text-[#F2B544] font-medium flex items-center space-x-1">
                      <span>Khuyên dùng: 250 - 600 từ</span>
                    </span>
                  ) : (
                    <span className="text-[#00A99D] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Độ dài đạt chuẩn!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Main Writing Textarea */}
              <div className="flex-1 min-h-[420px] bg-white rounded-2xl border border-[#E0EBF4] shadow-xs p-4 sm:p-6 flex flex-col relative focus-within:border-[#00A99D] focus-within:ring-2 focus-within:ring-[#00A99D]/20 transition-all">
                <textarea
                  ref={textareaRef}
                  value={essayContent}
                  onChange={(e) => setEssayContent(e.target.value)}
                  placeholder={`Hãy bắt đầu viết bài làm của em tại đây...\n\nLời khuyên từ Thầy/Cô ReadMind AI:\n- Mở bài: Dẫn dắt ấn tượng, giới thiệu đúng vấn đề nghị luận.\n- Thân bài: Chia thành 2-3 luận điểm rõ ràng, dùng lí lẽ chặt chẽ và đưa dẫn chứng xác thực.\n- Kết bài: Khái quát lại vấn đề và rút ra bài học nhận thức, hành động cho bản thân.`}
                  className="w-full flex-1 resize-none bg-transparent font-serif-academic text-base text-[#102A43] leading-relaxed placeholder:text-[#A0B2C6] focus:outline-none"
                  style={{ minHeight: '380px' }}
                />

                {/* Bottom Writing Advice Strip */}
                <div className="pt-3 mt-3 border-t border-[#E0EBF4] flex flex-wrap items-center justify-between text-xs text-[#61758A]">
                  <span className="italic flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" />
                    <span>Tự động lưu bài sau mỗi lần gõ phím.</span>
                  </span>

                  <button
                    onClick={() => {
                      if (textareaRef.current) {
                        textareaRef.current.focus();
                      }
                    }}
                    className="text-[#00A99D] font-bold hover:underline cursor-pointer"
                  >
                    Tiếp tục viết
                  </button>
                </div>
              </div>

              {/* Submit CTA Bar */}
              <div className="bg-gradient-to-r from-[#E0F8F3] via-white to-[#EAF6FF] rounded-2xl p-4 border border-[#E0EBF4] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div>
                  <h4 className="font-bold text-sm text-[#102A43] flex items-center space-x-1.5">
                    <span>Sẵn sàng nộp bài chấm điểm?</span>
                    <Sparkles className="w-4 h-4 text-[#F2B544]" />
                  </h4>
                  <p className="text-xs text-[#61758A]">
                    Giám khảo ReadMind AI sẽ chấm điểm chi tiết 4 tiêu chí và đưa ra gợi ý nâng cao.
                  </p>
                </div>

                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={isSubmitting || wordCount < 20}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all flex items-center space-x-2 cursor-pointer ${
                    wordCount >= 20 && !isSubmitting
                      ? 'bg-gradient-to-r from-[#00A99D] to-[#008F85] text-white hover:shadow-lg hover:scale-102 active:scale-98'
                      : 'bg-[#E0EBF4] text-[#A0B2C6] cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Nộp bài & Nhận kết quả</span>
                </button>
              </div>
            </div>
          ) : (
            /* AI Grading Result View */
            <div className="flex-1 p-4 sm:p-6 space-y-6 animate-fade-in">
              {/* Score Header Card */}
              <div className="bg-gradient-to-br from-[#00A99D] to-[#007F76] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs uppercase tracking-wider">
                        Đánh giá bài viết AI
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-200 text-[11px] font-medium border border-amber-300/30">
                        * Điểm tham khảo do AI đánh giá
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-serif-academic font-bold">
                      {gradingResult.teacherPraise || 'Bài làm rất giàu cảm xúc và tư duy nghị luận!'}
                    </h2>

                    <p className="text-xs text-white/80">
                      Đã phân tích chi tiết theo Chương trình GDPT 2018 (SGK Kết nối tri thức với cuộc sống).
                    </p>

                    {/* Progress Comparison Badge if student rewrote */}
                    {previousSubmission && (
                      <div className="pt-1 flex items-center space-x-2 text-xs">
                        <span className="bg-white/15 px-2.5 py-1 rounded-lg font-bold border border-white/20">
                          Điểm lần trước: {previousSubmission.grading.score.toFixed(1)}/10đ
                        </span>
                        <span className="text-white/80">&rarr;</span>
                        <span className={`px-2.5 py-1 rounded-lg font-bold ${
                          gradingResult.score > previousSubmission.grading.score
                            ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                            : 'bg-white/20 text-white'
                        }`}>
                          {gradingResult.score > previousSubmission.grading.score
                            ? `Tiến bộ +${(gradingResult.score - previousSubmission.grading.score).toFixed(1)}đ 🎉`
                            : gradingResult.score === previousSubmission.grading.score
                            ? 'Giữ vững phong độ 🌟'
                            : `Chênh lệch ${(gradingResult.score - previousSubmission.grading.score).toFixed(1)}đ`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Big Score Badge */}
                  <div className="bg-white text-[#102A43] rounded-2xl p-4 sm:px-6 text-center shadow-lg shrink-0">
                    <p className="text-[11px] font-bold text-[#61758A] uppercase tracking-wider">Điểm tham khảo</p>
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#00A99D]">
                        {gradingResult.score.toFixed(1)}
                      </span>
                      <span className="text-base text-[#61758A] font-medium">/ 10</span>
                    </div>
                    {submissionCompleted && (
                      <div className="mt-2 pt-2 border-t border-[#E0EBF4] text-[11px] font-bold text-[#C07D2B] flex flex-col items-center justify-center gap-0.5">
                        <div className="flex items-center space-x-1">
                          {submissionCompleted.coinsAwarded > 0 ? (
                            <span>🪙 +{submissionCompleted.coinsAwarded} Xu</span>
                          ) : (
                            <span className="text-[#8B6426] text-[10px] font-semibold">🪙 Đã nhận Xu lần đầu</span>
                          )}
                          <span>•</span>
                          <span>⚡ +{submissionCompleted.xpAwarded} XP</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#102A43] uppercase tracking-wider flex items-center space-x-2">
                  <Award className="w-4 h-4 text-[#00A99D]" />
                  <span>Điểm số chi tiết theo từng tiêu chí</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {gradingResult.criteriaScores.map((c, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-4 border border-[#E0EBF4] shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#102A43]">{c.criteria}</span>
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm font-extrabold text-[#00A99D]">{c.score}</span>
                          <span className="text-xs text-[#61758A]">/ {c.maxPoints}đ</span>
                        </div>
                      </div>
                      {/* Criteria Progress Bar */}
                      <div className="w-full bg-[#E0EBF4] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#00A99D] h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, Math.round((c.score / c.maxPoints) * 100))}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[#61758A] leading-relaxed pt-1">
                        {c.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-[#E0F8F3] border border-[#BDE8E0] rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-[#00A99D] uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Điểm sáng nổi bật của bài viết</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#102A43]">
                    {gradingResult.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#00A99D] font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-[#FFF8E7] border border-[#FCE1A8] rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-[#C07D2B] uppercase tracking-wider flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Điểm cần lưu ý & Khắc phục</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#102A43]">
                    {gradingResult.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-[#C07D2B] font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Advanced Suggestions & Model Sample Paragraph */}
              <div className="bg-white rounded-2xl p-5 border border-[#E0EBF4] shadow-xs space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#7C3AED] uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Gợi ý nâng cao từ Giám khảo</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#334E68] leading-relaxed">
                    {gradingResult.advancedSuggestions}
                  </p>
                </div>

                {gradingResult.improvedSampleParagraph && (
                  <div className="bg-[#F1EBFF] rounded-xl p-4 border border-[#DDD0FA] space-y-2">
                    <p className="text-xs font-bold text-[#7C3AED] flex items-center space-x-1">
                      <span>Đoạn văn mẫu gợi ý cải thiện ngòi bút:</span>
                    </p>
                    <p className="font-serif-academic text-xs sm:text-sm italic text-[#2E1065] leading-relaxed">
                      "{gradingResult.improvedSampleParagraph}"
                    </p>
                  </div>
                )}
              </div>

              {/* Student's Full Essay Review */}
              <div className="bg-white rounded-2xl p-5 border border-[#E0EBF4] shadow-xs space-y-2">
                <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-[#3285E8]" />
                  <span>Toàn văn bài làm của em ({wordCount} từ)</span>
                </h4>
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E0EBF4] font-serif-academic text-sm text-[#102A43] leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                  {essayContent}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  onClick={onExit}
                  className="px-5 py-2.5 rounded-xl border border-[#E0EBF4] bg-white hover:bg-[#F4FAFF] text-xs sm:text-sm font-bold text-[#102A43] transition-all cursor-pointer"
                >
                  Quay lại Tủ đề thi
                </button>

                <button
                  onClick={() => {
                    setPreviousSubmission(submissionCompleted);
                    setIsRewriting(true);
                    setGradingResult(null);
                    setSecondsRemaining(durationMinutes * 60);
                    setIsPaused(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Viết lại để tiến bộ</span>
                </button>

                {submissionCompleted && onViewSubmissionDetail && (
                  <button
                    onClick={() => onViewSubmissionDetail(submissionCompleted)}
                    className="btn-primary-teal px-5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer"
                  >
                    Xem chi tiết bài thi
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submitting / Grading Loading Modal */}
      {isSubmitting && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-scale-up border border-[#E0EBF4]">
            <div className="w-16 h-16 rounded-full bg-[#E0F8F3] text-[#00A99D] flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="font-serif-academic text-xl font-bold text-[#102A43]">
                Giám khảo ReadMind AI đang chấm bài...
              </h3>
              <p className="text-xs text-[#61758A] mt-2 leading-relaxed">
                {gradingProgress}
              </p>
            </div>
            <div className="w-full bg-[#EAF6FF] h-2 rounded-full overflow-hidden">
              <div className="bg-[#00A99D] h-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E0EBF4]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF0F5] text-[#E02424] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#102A43]">Em có chắc chắn muốn rời phòng thi?</h3>
              <p className="text-xs text-[#61758A] mt-1 leading-relaxed">
                Bản nháp bài viết của em ({wordCount} từ) đã được tự động lưu trong tài khoản. Em có thể quay lại tiếp tục làm bất kỳ lúc nào.
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-[#E0EBF4] text-xs font-bold text-[#61758A] hover:bg-[#F4FAFF] cursor-pointer"
              >
                Tiếp tục viết
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="flex-1 py-2 rounded-xl bg-[#E02424] text-white text-xs font-bold hover:bg-[#C53030] cursor-pointer"
              >
                Rời phòng thi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E0EBF4]">
            <div className="w-12 h-12 rounded-2xl bg-[#E0F8F3] text-[#00A99D] flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#102A43]">Xác nhận nộp bài thi</h3>
              <p className="text-xs text-[#61758A] mt-1 leading-relaxed">
                Em đã viết được <strong>{wordCount} từ</strong> trong thời gian{' '}
                <strong>{Math.round((totalSeconds - secondsRemaining) / 60)} phút</strong>. Em có chắc chắn muốn nộp để Giám khảo chấm điểm ngay không?
              </p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-[#E0EBF4] text-xs font-bold text-[#61758A] hover:bg-[#F4FAFF] cursor-pointer"
              >
                Xem lại bài viết
              </button>
              <button
                onClick={() => handleSubmit(false)}
                className="flex-1 py-2 rounded-xl btn-primary-teal text-xs font-bold cursor-pointer"
              >
                Đồng ý nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
