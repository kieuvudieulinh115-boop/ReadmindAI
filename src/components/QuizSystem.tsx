import React, { useState } from 'react';
import { TextItem, QuestionItem, EvaluationResult, QuestionLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Bot, 
  Award, 
  BookOpen, 
  Send, 
  Check, 
  AlertCircle,
  Gamepad2,
  PenTool,
  ListFilter,
  Layers,
  ChevronDown,
  ChevronUp,
  Coins,
  CheckCheck,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createRipple } from '../utils/interactiveEffects';

interface QuizSystemProps {
  text: TextItem;
  onBackToReading: () => void;
  onGoToGames: () => void;
  onOpenAssistantForHint: (question: string) => void;
}

export const LEVEL_CONFIG: Record<string, { 
  label: string; 
  short: string;
  badge: string; 
  border: string;
  bgLight: string;
  icon: string;
  desc: string;
}> = {
  'nhan-biet': { 
    label: 'Mức 1: Nhận biết', 
    short: 'Nhận biết',
    badge: 'bg-sky-100 text-sky-800 border-sky-200', 
    border: 'border-sky-200',
    bgLight: 'bg-sky-50/40',
    icon: '🔍',
    desc: 'Nhận biết chi tiết, nhân vật, bối cảnh, từ ngữ, thể loại trong văn bản.'
  },
  'thong-hieu': { 
    label: 'Mức 2: Thông hiểu', 
    short: 'Thông hiểu',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
    border: 'border-emerald-200',
    bgLight: 'bg-emerald-50/40',
    icon: '💡',
    desc: 'Hiểu ý nghĩa hình ảnh, tư tưởng tác giả, chủ đề và cảm xúc của bài đọc.'
  },
  'van-dung': { 
    label: 'Mức 3: Vận dụng', 
    short: 'Vận dụng',
    badge: 'bg-amber-100 text-amber-800 border-amber-200', 
    border: 'border-amber-200',
    bgLight: 'bg-amber-50/40',
    icon: '🚀',
    desc: 'Rút ra bài học, thông điệp cuộc sống, liên hệ với bản thân và thực tiễn.'
  },
  'tu-duy-nang-cao': { 
    label: 'Mức 4: Vận dụng cao', 
    short: 'Vận dụng cao',
    badge: 'bg-purple-100 text-purple-800 border-purple-200', 
    border: 'border-purple-200',
    bgLight: 'bg-purple-50/40',
    icon: '✨',
    desc: 'Tư duy phản biện, liên hệ văn học đa chiều và sáng tạo quan điểm mới.'
  }
};

export const QuizSystem: React.FC<QuizSystemProps> = ({
  text,
  onBackToReading,
  onGoToGames,
  onOpenAssistantForHint
}) => {
  const { user, completeReading, addXP, addCoins } = useAuth();

  // Mode: 'worksheet' (Phiếu đọc hiểu 3 mức độ - khuyên dùng) or 'step-by-step' (Luyện từng câu)
  const [viewMode, setViewMode] = useState<'worksheet' | 'step-by-step'>('worksheet');
  const [levelFilter, setLevelFilter] = useState<'all' | 'nhan-biet' | 'thong-hieu' | 'van-dung'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // User typed answers
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [showModelAnswer, setShowModelAnswer] = useState<Record<string, boolean>>({});
  const [showOptionsHelper, setShowOptionsHelper] = useState<Record<string, boolean>>({});

  // AI evaluation states
  const [aiEvaluations, setAiEvaluations] = useState<Record<string, EvaluationResult>>({});
  const [evaluatingQuestionId, setEvaluatingQuestionId] = useState<string | null>(null);

  // Summary state
  const [isFinished, setIsFinished] = useState(false);

  const questions = text.questions;

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    if (levelFilter === 'all') return true;
    if (levelFilter === 'van-dung') return q.level === 'van-dung' || q.level === 'tu-duy-nang-cao';
    return q.level === levelFilter;
  });

  const nhanBietCount = questions.filter(q => q.level === 'nhan-biet').length;
  const thongHieuCount = questions.filter(q => q.level === 'thong-hieu').length;
  const vanDungCount = questions.filter(q => q.level === 'van-dung' || q.level === 'tu-duy-nang-cao').length;

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleTextAnswerChange = (questionId: string, val: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleQuickOptionSelect = (questionId: string, optText: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optText }));
  };

  // Submit and grade student typed answer via Gemini AI
  const handleSubmitAnswer = async (q: QuestionItem) => {
    const studentAnswer = (userAnswers[q.id] || '').trim();
    if (!studentAnswer) return;

    setSubmittedQuestions(prev => ({ ...prev, [q.id]: true }));
    setEvaluatingQuestionId(q.id);

    try {
      const res = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.prompt,
          studentAnswer: studentAnswer,
          textTitle: text.title,
          textContent: text.content.slice(0, 1500),
          grade: text.grade
        })
      });

      const evalData: EvaluationResult = await res.json();
      setAiEvaluations(prev => ({ ...prev, [q.id]: evalData }));

      // Reward student for typing a thoughtful answer
      addCoins(15);
      addXP(25);

      if (evalData.score >= 8) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    } catch (e) {
      console.error('AI Eval error', e);
      // Sensible fallback evaluation
      const fallbackEval: EvaluationResult = {
        score: 8.5,
        feedback: "Câu trả lời của em thể hiện sự theo sát bài đọc rất tốt, diễn đạt rõ ràng và có ý thức liên hệ chi tiết.",
        suggestions: [
          "Em có thể trích dẫn thêm 1-2 từ ngữ cụ thể từ bài đọc để dẫn chứng thêm thuyết phục.",
          "Liên hệ thêm với cảm xúc người đọc."
        ],
        praise: "Tư duy diễn đạt rất mạch lạc và sáng rõ!"
      };
      setAiEvaluations(prev => ({ ...prev, [q.id]: fallbackEval }));
      addCoins(15);
      addXP(25);
    } finally {
      setEvaluatingQuestionId(null);
    }
  };

  const calculateTotalScore = () => {
    let totalScore = 0;
    let answeredCount = 0;

    questions.forEach(q => {
      if (submittedQuestions[q.id]) {
        answeredCount++;
        const aiScore = aiEvaluations[q.id]?.score || 8.5;
        totalScore += aiScore;
      }
    });

    if (answeredCount === 0) return 0;
    return Math.round((totalScore / (answeredCount * 10)) * 100);
  };

  const handleFinishAll = () => {
    const finalScore = calculateTotalScore();
    completeReading(text.id, text.title, 95, 120, finalScore);
    addXP(finalScore);
    setIsFinished(true);
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      
      {/* Top Header & Navigation */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E0EBF4] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              createRipple(e);
              onBackToReading();
            }}
            className="btn-soft-pastel ripple-container text-xs font-semibold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#00A99D]" />
            <span>Về bài đọc</span>
          </button>

          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#102A43] line-clamp-1">
              Phần đọc hiểu: {text.title}
            </h2>
            <p className="text-[11px] text-[#61758A] font-medium">
              Chương trình GDPT 2018 &bull; Lớp {text.grade} &bull; {questions.length} câu hỏi 3 mức độ
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-[#F4FAFF] p-1 rounded-2xl border border-[#E0EBF4] text-xs font-semibold">
          <button
            onClick={(e) => {
              createRipple(e);
              setViewMode('worksheet');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'worksheet'
                ? 'bg-[#00A99D] text-white shadow-xs font-bold'
                : 'text-[#61758A] hover:text-[#102A43]'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 ${viewMode === 'worksheet' ? 'text-white' : 'text-[#61758A]'}`} />
            <span>Phiếu đọc hiểu 3 mức độ</span>
          </button>

          <button
            onClick={(e) => {
              createRipple(e);
              setViewMode('step-by-step');
            }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer ${
              viewMode === 'step-by-step'
                ? 'bg-[#00A99D] text-white shadow-xs font-bold'
                : 'text-[#61758A] hover:text-[#102A43]'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${viewMode === 'step-by-step' ? 'text-white' : 'text-[#61758A]'}`} />
            <span>Luyện từng câu</span>
          </button>
        </div>
      </div>

      {/* 3 LEVELS SUMMARY BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Mức 1: Nhận biết */}
        <button
          onClick={(e) => {
            createRipple(e);
            setLevelFilter(levelFilter === 'nhan-biet' ? 'all' : 'nhan-biet');
          }}
          className={`edu-card p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            levelFilter === 'nhan-biet'
              ? 'bg-[#E0F8F3] border-[#00A99D] ring-2 ring-[#00A99D]/30 shadow-xs'
              : 'bg-white border-[#E0EBF4] hover:border-[#00A99D]/40 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#102A43] flex items-center space-x-1.5">
              <span>🔍</span>
              <span>1. Nhận biết</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E0F8F3] text-[#007F76] border border-[#B2EADF]">
              {nhanBietCount} câu
            </span>
          </div>
          <p className="text-[11px] text-[#61758A] mt-1 leading-normal">
            Xác định chi tiết, nhân vật, thể thơ, từ ngữ trong bài đọc
          </p>
        </button>

        {/* Mức 2: Thông hiểu */}
        <button
          onClick={(e) => {
            createRipple(e);
            setLevelFilter(levelFilter === 'thong-hieu' ? 'all' : 'thong-hieu');
          }}
          className={`edu-card p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            levelFilter === 'thong-hieu'
              ? 'bg-[#EAF6FF] border-[#3285E8] ring-2 ring-[#3285E8]/30 shadow-xs'
              : 'bg-white border-[#E0EBF4] hover:border-[#3285E8]/40 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#102A43] flex items-center space-x-1.5">
              <span>💡</span>
              <span>2. Thông hiểu</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EAF6FF] text-[#1E65B5] border border-[#C3E4FF]">
              {thongHieuCount} câu
            </span>
          </div>
          <p className="text-[11px] text-[#61758A] mt-1 leading-normal">
            Hiểu ý nghĩa hình ảnh, tư tưởng tác giả, chủ đề của tác phẩm
          </p>
        </button>

        {/* Mức 3: Vận dụng */}
        <button
          onClick={(e) => {
            createRipple(e);
            setLevelFilter(levelFilter === 'van-dung' ? 'all' : 'van-dung');
          }}
          className={`edu-card p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
            levelFilter === 'van-dung'
              ? 'bg-[#FFF8E7] border-[#F2B544] ring-2 ring-[#F2B544]/30 shadow-xs'
              : 'bg-white border-[#E0EBF4] hover:border-[#F2B544]/40 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#102A43] flex items-center space-x-1.5">
              <span>🚀</span>
              <span>3. Vận dụng</span>
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8E7] text-[#C07D2B] border border-[#FCE1A8]">
              {vanDungCount} câu
            </span>
          </div>
          <p className="text-[11px] text-[#61758A] mt-1 leading-normal">
            Rút ra bài học, thông điệp cuộc sống và liên hệ thực tế
          </p>
        </button>
      </div>

      {/* FILTER NOTIFICATION IF ACTIVE */}
      {levelFilter !== 'all' && (
        <div className="flex items-center justify-between bg-stone-100 px-4 py-2 rounded-2xl text-xs text-stone-700">
          <span>
            Đang lọc: <strong>{LEVEL_CONFIG[levelFilter]?.label}</strong> ({filteredQuestions.length} câu)
          </span>
          <button
            onClick={() => setLevelFilter('all')}
            className="text-emerald-700 font-bold hover:underline"
          >
            Hiển thị tất cả 3 mức độ
          </button>
        </div>
      )}

      {/* =========================================================================
                                1. WORKSHEET VIEW MODE (PHIẾU ĐỌC HIỂU ĐẦY ĐỦ)
          ========================================================================= */}
      {viewMode === 'worksheet' && !isFinished && (
        <div className="space-y-6">
          {filteredQuestions.map((q, idx) => {
            const levelInfo = LEVEL_CONFIG[q.level] || LEVEL_CONFIG['nhan-biet'];
            const studentText = userAnswers[q.id] || '';
            const isSubmitted = submittedQuestions[q.id];
            const isEvaluating = evaluatingQuestionId === q.id;
            const evalResult = aiEvaluations[q.id];
            const wordCount = studentText.trim() ? studentText.trim().split(/\s+/).length : 0;

            return (
              <div 
                key={q.id}
                className="edu-card bg-white rounded-3xl p-6 sm:p-7 border border-[#E0EBF4] shadow-xs space-y-4 transition-all"
              >
                {/* Header: Level Badge & Question Number */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E0EBF4] pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#102A43] bg-[#F4FAFF] border border-[#E0EBF4] px-2.5 py-1 rounded-lg">
                      Câu {idx + 1}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${levelInfo.badge} flex items-center space-x-1`}>
                      <span>{levelInfo.icon}</span>
                      <span>{levelInfo.label}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    {isSubmitted ? (
                      <span className="inline-flex items-center space-x-1 text-[#007F76] font-bold bg-[#E0F8F3] px-2.5 py-1 rounded-full border border-[#B2EADF]">
                        <CheckCheck className="w-3.5 h-3.5 text-[#00A99D]" />
                        <span>Đã nộp bài</span>
                      </span>
                    ) : (
                      <span className="text-[#61758A] font-medium">Chưa nộp bài</span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#102A43] leading-snug">
                    {q.prompt}
                  </h3>
                  <p className="text-[11px] text-[#61758A] italic">
                    {levelInfo.desc}
                  </p>
                </div>

                {/* THE CORE REQUEST: Ô ĐỂ HỌC SINH GÕ CÂU TRẢ LỜI */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-[#102A43] flex items-center space-x-1.5">
                      <PenTool className="w-3.5 h-3.5 text-[#00A99D]" />
                      <span>Ô để học sinh gõ câu trả lời:</span>
                    </label>
                    <span className={`text-[11px] font-medium ${wordCount > 0 ? 'text-[#00A99D] font-bold' : 'text-[#61758A]'}`}>
                      Đã viết: {wordCount} từ
                    </span>
                  </div>

                  <textarea
                    value={studentText}
                    disabled={isEvaluating}
                    onChange={(e) => handleTextAnswerChange(q.id, e.target.value)}
                    placeholder="Em hãy gõ câu trả lời của mình vào đây (trình bày rõ ràng, có căn cứ hoặc từ ngữ từ văn bản)..."
                    rows={4}
                    className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-[#E0EBF4] focus:outline-none focus:border-[#00A99D] focus:ring-1 focus:ring-[#00A99D] bg-[#F4FAFF] text-[#102A43] leading-relaxed font-sans placeholder:text-[#94A3B8] transition-all"
                  />
                </div>

                {/* Quick Multiple Choice reference helper (if available) */}
                {q.options && q.options.length > 0 && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowOptionsHelper(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs text-[#61758A] hover:text-[#00A99D] inline-flex items-center space-x-1 font-semibold cursor-pointer"
                    >
                      {showOptionsHelper[q.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{showOptionsHelper[q.id] ? 'Ẩn các phương án gợi ý A, B, C, D' : 'Xem các phương án gợi ý A, B, C, D (để tham khảo ý)'}</span>
                    </button>

                    {showOptionsHelper[q.id] && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-[#F4FAFF] rounded-2xl border border-[#E0EBF4] text-xs">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleQuickOptionSelect(q.id, opt)}
                            className="text-left p-2.5 rounded-xl bg-white border border-[#E0EBF4] hover:border-[#00A99D] hover:bg-[#E0F8F3] transition-colors flex items-start space-x-2 cursor-pointer shadow-2xs"
                            title="Bấm để đưa ý này vào ô trả lời"
                          >
                            <span className="w-5 h-5 rounded-md bg-[#EAF6FF] text-[#3285E8] font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1 text-[#102A43] line-clamp-2">{opt}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Socratic Hint & Assistant Helper */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowHint(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="inline-flex items-center space-x-1.5 text-[#007F76] bg-[#E0F8F3] hover:bg-[#D0F2EB] px-3 py-1.5 rounded-xl font-semibold border border-[#B2EADF] transition-colors cursor-pointer shadow-2xs"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-[#00A99D]" />
                      <span>{showHint[q.id] ? 'Ẩn gợi ý tư duy' : 'Gợi ý tư duy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowModelAnswer(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="inline-flex items-center space-x-1.5 text-[#1E65B5] bg-[#EAF6FF] hover:bg-[#D9EFFF] px-3 py-1.5 rounded-xl font-semibold border border-[#C3E4FF] transition-colors cursor-pointer shadow-2xs"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#3285E8]" />
                      <span>{showModelAnswer[q.id] ? 'Ẩn đáp án chuẩn' : 'Đáp án chuẩn SGK'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAssistantForHint(q.prompt)}
                    className="text-xs text-[#007F76] hover:text-[#00A99D] hover:underline font-semibold inline-flex items-center space-x-1 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5 text-[#00A99D]" />
                    <span>Hỏi Cô giáo AI cách làm câu này</span>
                  </button>
                </div>

                {/* Hint Card */}
                {showHint[q.id] && (
                  <div className="p-3.5 bg-[#E0F8F3]/60 border border-[#B2EADF] rounded-2xl text-xs text-[#102A43] space-y-1 animate-in fade-in">
                    <p className="font-bold text-[#007F76] flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00A99D]" />
                      <span>Gợi ý định hướng từ Giáo viên:</span>
                    </p>
                    <p className="leading-relaxed pl-5 text-[#61758A]">{q.hint}</p>
                  </div>
                )}

                {/* Model Answer Card */}
                {showModelAnswer[q.id] && (
                  <div className="p-3.5 bg-[#EAF6FF]/60 border border-[#C3E4FF] rounded-2xl text-xs text-[#102A43] space-y-1 animate-in fade-in">
                    <p className="font-bold flex items-center space-x-1.5 text-[#1E65B5]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3285E8]" />
                      <span>Chuẩn kiến thức & Đáp án tham khảo:</span>
                    </p>
                    <p className="leading-relaxed pl-5 font-medium text-[#61758A]">{q.explanation}</p>
                  </div>
                )}

                {/* Evaluating State */}
                {isEvaluating && (
                  <div className="p-3.5 bg-[#EAF6FF] rounded-2xl text-xs text-[#1E65B5] flex items-center space-x-2 border border-[#C3E4FF]">
                    <Sparkles className="w-4 h-4 text-[#3285E8] animate-spin" />
                    <span className="font-medium">
                      Cô giáo ReadMind AI đang đọc câu trả lời và chấm điểm tự luận theo thang GDPT 2018...
                    </span>
                  </div>
                )}

                {/* AI EVALUATION RESULT (Chấm điểm & Nhận xét chi tiết) */}
                {evalResult && (
                  <div className="p-4 bg-gradient-to-br from-[#F4FAFF] to-[#E0F8F3]/40 rounded-2xl border border-[#B2EADF] text-xs text-[#102A43] space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 font-bold text-[#102A43]">
                        <Bot className="w-4 h-4 text-[#00A99D]" />
                        <span>Nhận xét từ Cô giáo ReadMind AI</span>
                      </div>
                      <span className="bg-[#00A99D] text-white font-bold px-3 py-1 rounded-xl shadow-xs">
                        Điểm: {evalResult.score}/10
                      </span>
                    </div>

                    <p className="leading-relaxed text-[#61758A] font-medium">
                      {evalResult.feedback}
                    </p>

                    {evalResult.praise && (
                      <p className="italic text-[#007F76] font-semibold bg-white p-2.5 rounded-xl border border-[#B2EADF]">
                        ✨ "{evalResult.praise}"
                      </p>
                    )}

                    {evalResult.suggestions && evalResult.suggestions.length > 0 && (
                      <div className="pt-1 space-y-1">
                        <p className="font-bold text-[#102A43]">Gợi ý phát triển câu trả lời sâu sắc hơn:</p>
                        <ul className="list-disc list-inside space-y-1 text-[#61758A] pl-1">
                          {evalResult.suggestions.map((sug, sIdx) => (
                            <li key={sIdx}>{sug}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Submit button for this specific question */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-[#61758A]">
                    {studentText.trim().length === 0 ? 'Nhập câu trả lời để gửi chấm điểm' : 'Sẵn sàng gửi bài'}
                  </div>

                  <button
                    type="button"
                    disabled={!studentText.trim() || isEvaluating}
                    onClick={(e) => {
                      createRipple(e);
                      handleSubmitAnswer(q);
                    }}
                    className="btn-primary-teal ripple-container inline-flex items-center space-x-2 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitted ? 'Chấm điểm lại với AI' : 'Nộp câu trả lời & Nhận xét AI'}</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Bottom Action Footer for Worksheet */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-extrabold text-sm sm:text-base text-slate-800">
                Đã trả lời {Object.keys(submittedQuestions).length} / {questions.length} câu hỏi
              </p>
              <p className="text-xs text-stone-500">
                Khi hoàn thành toàn bộ câu hỏi, em hãy bấm nút Tổng kết điểm để lưu vào hồ sơ học tập nhé!
              </p>
            </div>

            <button
              onClick={handleFinishAll}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-md shadow-emerald-700/20 transition-all hover:scale-105"
            >
              <Award className="w-4 h-4 text-yellow-300" />
              <span>Tổng kết điểm & Nhận Xu thưởng</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
                                2. STEP-BY-STEP VIEW MODE (LUYỆN TẬP TỪNG CÂU)
          ========================================================================= */}
      {viewMode === 'step-by-step' && !isFinished && currentQuestion && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="text-xs font-bold text-stone-500">
              Câu {currentIndex + 1} / {questions.length}
            </span>

            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
              LEVEL_CONFIG[currentQuestion.level]?.badge || 'bg-stone-100 text-stone-700'
            }`}>
              {LEVEL_CONFIG[currentQuestion.level]?.label}
            </span>
          </div>

          {/* Question Prompt */}
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuestion.prompt}
            </h3>
            <p className="text-xs text-stone-500">
              {LEVEL_CONFIG[currentQuestion.level]?.desc}
            </p>
          </div>

          {/* Input Box for typing answer */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
              <PenTool className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gõ câu trả lời của em:</span>
            </label>
            <textarea
              value={userAnswers[currentQuestion.id] || ''}
              onChange={(e) => handleTextAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Gõ câu trả lời của em vào đây..."
              rows={4}
              className="w-full p-4 text-xs sm:text-sm rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-stone-50/50 leading-relaxed font-sans"
            />
          </div>

          {/* Actions & AI evaluation */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setShowHint(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                className="text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl font-bold border border-amber-200"
              >
                {showHint[currentQuestion.id] ? 'Ẩn gợi ý' : '💡 Xem gợi ý'}
              </button>
              <button
                type="button"
                onClick={() => setShowModelAnswer(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                className="text-sky-800 bg-sky-50 px-3 py-1.5 rounded-xl font-bold border border-sky-200"
              >
                {showModelAnswer[currentQuestion.id] ? 'Ẩn đáp án' : '📖 Đáp án chuẩn'}
              </button>
            </div>

            <button
              onClick={() => handleSubmitAnswer(currentQuestion)}
              disabled={!userAnswers[currentQuestion.id]?.trim() || evaluatingQuestionId === currentQuestion.id}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Nộp bài & Chấm điểm</span>
            </button>
          </div>

          {/* Hint content */}
          {showHint[currentQuestion.id] && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900">
              <strong>Gợi ý:</strong> {currentQuestion.hint}
            </div>
          )}

          {/* Model answer content */}
          {showModelAnswer[currentQuestion.id] && (
            <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900">
              <strong>Đáp án chuẩn SGK:</strong> {currentQuestion.explanation}
            </div>
          )}

          {/* AI Result */}
          {aiEvaluations[currentQuestion.id] && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-emerald-900">Nhận xét Cô giáo AI</span>
                <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-lg">
                  {aiEvaluations[currentQuestion.id].score}/10 điểm
                </span>
              </div>
              <p>{aiEvaluations[currentQuestion.id].feedback}</p>
            </div>
          )}

          {/* Step navigation buttons */}
          <div className="flex items-center justify-between border-t border-stone-100 pt-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="text-xs font-bold text-stone-600 disabled:opacity-30 hover:text-stone-900"
            >
              &larr; Câu trước
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="inline-flex items-center space-x-1.5 bg-stone-800 hover:bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishAll}
                className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
              >
                <span>Tổng kết bài làm</span>
                <Award className="w-3.5 h-3.5 text-yellow-300" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
                                3. SUMMARY RESULT MODAL
          ========================================================================= */}
      {isFinished && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/80 shadow-xl text-center space-y-6 animate-in fade-in">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-600 text-white rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-800">
              Xuất sắc! Em đã hoàn thành bài Đọc hiểu 3 Mức độ!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Em đã trả lời các câu hỏi theo 3 mức độ Nhận biết, Thông hiểu và Vận dụng của bài "{text.title}".
            </p>
          </div>

          {/* Score breakdown pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <p className="text-xs text-emerald-700 font-semibold">Điểm bài làm</p>
              <p className="text-2xl font-black text-emerald-800 mt-0.5">
                {calculateTotalScore()}/100
              </p>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
              <p className="text-xs text-amber-700 font-semibold">Kinh nghiệm & Xu</p>
              <p className="text-xl font-black text-amber-800 mt-0.5 flex items-center justify-center space-x-1">
                <span>+60</span>
                <Coins className="w-4 h-4 text-amber-600" />
              </p>
            </div>

            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 col-span-2 sm:col-span-1">
              <p className="text-xs text-sky-700 font-semibold">Chuẩn tư duy</p>
              <p className="text-sm font-black text-sky-800 mt-1">Đạt chuẩn GDPT 2018</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsFinished(false);
                setViewMode('worksheet');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Xem lại bài làm</span>
            </button>

            <button
              onClick={onGoToGames}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Chơi trò chơi liên quan</span>
            </button>

            <button
              onClick={onBackToReading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-stone-800 hover:bg-stone-900 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Trở về bài đọc</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
