import React, { useState, useEffect, useMemo } from 'react';
import { TextItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Gamepad2, 
  Trophy, 
  Timer, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  ListOrdered, 
  Search, 
  Key, 
  Award, 
  HelpCircle,
  MoveUp,
  MoveDown,
  BookOpen,
  Filter,
  Layers,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createRipple } from '../utils/interactiveEffects';

interface GamesCenterProps {
  texts: TextItem[];
  selectedText?: TextItem;
  onSelectText: (text: TextItem) => void;
  onOpenRewardShop?: () => void;
  onGoToReading?: (text: TextItem) => void;
}

type GameId = 'quiz-master' | 'story-order' | 'keyword-hunt' | 'secret-decoder';

/**
 * Intelligent helper to guarantee valid events for Game 2 for ANY work (prose or poem)
 */
function getEventsForText(text: TextItem): string[] {
  if (text.storyEvents && text.storyEvents.length >= 3) {
    return text.storyEvents;
  }

  if (text.isPoem) {
    const stanzas = text.content.split('\n\n').filter(s => s.trim().length > 0);
    if (stanzas.length >= 3) {
      return stanzas.slice(0, 5).map((st, idx) => {
        const firstLine = st.split('\n')[0].trim();
        return `Khổ thơ ${idx + 1}: Diễn tả cảm xúc mở đầu bằng "${firstLine}..."`;
      });
    }
  }

  // Extract from paragraphs
  const paras = text.content.split('\n\n').filter(p => p.trim().length > 20);
  if (paras.length >= 3) {
    return paras.slice(0, 5).map((p, idx) => {
      const snippet = p.replace(/\s+/g, ' ').slice(0, 65).trim();
      return `Chặng ${idx + 1}: ${snippet}...`;
    });
  }

  return [
    `Khởi đầu: Bối cảnh và ấn tượng mở đầu của tác phẩm "${text.title}".`,
    `Phát triển: Những diễn biến tâm lý, tình cảm và hình ảnh trung tâm.`,
    `Cao trào: Khoảnh khắc bộc lộ sâu sắc nhất chủ đề tư tưởng.`,
    `Kết thúc: Bài học nhân sinh và cảm xúc lắng đọng của tác giả.`
  ];
}

/**
 * Helper to guarantee valid keywords for Game 3 for ANY work
 */
function getKeywordsForText(text: TextItem): { word: string; isCorrect: boolean; explanation: string }[] {
  if (text.keywordsToFind && text.keywordsToFind.length >= 3) {
    return text.keywordsToFind;
  }

  const result: { word: string; isCorrect: boolean; explanation: string }[] = [];
  if (text.vocabularyList && text.vocabularyList.length > 0) {
    text.vocabularyList.slice(0, 3).forEach(v => {
      result.push({
        word: v.word,
        isCorrect: true,
        explanation: `${v.meaning} (Từ khóa cốt lõi trong văn bản).`
      });
    });
  } else {
    result.push(
      { word: 'Tình cảm', isCorrect: true, explanation: 'Mạch cảm xúc chủ đạo của tác phẩm.' },
      { word: 'Nhân ái', isCorrect: true, explanation: 'Giá trị nhân văn cao đẹp được ngợi ca.' }
    );
  }

  // Add distractors
  result.push(
    { word: 'Vật chất', isCorrect: false, explanation: 'Chi tiết bề ngoài không phải giá trị tinh thần trọng tâm.' },
    { word: 'Thờ ơ', isCorrect: false, explanation: 'Trái ngược với thông điệp đồng cảm, sẻ chia của tác phẩm.' }
  );

  return result;
}

/**
 * Helper to guarantee a valid secret message for Game 4 for ANY work
 */
function getSecretMessageForText(text: TextItem): {
  clue: string;
  encoded: string;
  answer: string;
  meaning: string;
} {
  if (text.secretMessage) {
    return text.secretMessage;
  }

  // Curated fallback messages based on genre and keywords
  const titleLower = text.title.toLowerCase();
  if (titleLower.includes('bạn') || titleLower.includes('tinh nghich') || titleLower.includes('nang')) {
    return {
      clue: 'Giá trị thiêng liêng và trong sáng nhất của tuổi học trò trong tác phẩm',
      encoded: 'T-I-N-H-B-A-N',
      answer: 'TÌNH BẠN',
      meaning: 'Tình bạn vô tư, chân thành gắn kết những tâm hồn trong sáng.'
    };
  }

  if (titleLower.includes('quê') || titleLower.includes('đồng') || titleLower.includes('núi') || titleLower.includes('trăng')) {
    return {
      clue: 'Tình cảm sâu nặng hướng về cội nguồn non sông đất nước',
      encoded: 'Q-U-E-H-U-O-N-G',
      answer: 'QUÊ HƯƠNG',
      meaning: 'Quê hương luôn là điểm tựa tâm hồn và nguồn mạch yêu thương bất tận.'
    };
  }

  return {
    clue: 'Phẩm chất đạo đức cao đẹp mà nhà văn gửi gắm qua bài học',
    encoded: 'N-H-A-N-A-I',
    answer: 'NHÂN ÁI',
    meaning: 'Lòng thương người và tấm lòng bao dung luôn là nét đẹp cao quý nhất.'
  };
}

export const GamesCenter: React.FC<GamesCenterProps> = ({
  texts,
  selectedText: propSelectedText,
  onSelectText,
  onOpenRewardShop,
  onGoToReading
}) => {
  const { user, addXP, addCoins, unlockBadge } = useAuth();

  const [activeGame, setActiveGame] = useState<GameId>('quiz-master');
  
  // Selected Text State
  const [internalSelectedText, setInternalSelectedText] = useState<TextItem>(
    propSelectedText || texts[0]
  );

  const activeText = internalSelectedText || texts[0];

  // Unit / Lesson Filter State
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  // Extract unique units for current grade
  const availableUnits = useMemo(() => {
    const set = new Set<string>();
    texts.forEach(t => {
      if (t.unit) set.add(t.unit);
    });
    return Array.from(set);
  }, [texts]);

  // Filtered texts according to selected unit
  const filteredTexts = useMemo(() => {
    if (selectedUnit === 'all') return texts;
    return texts.filter(t => t.unit === selectedUnit);
  }, [texts, selectedUnit]);

  // Coin Reward Toast
  const [coinRewardToast, setCoinRewardToast] = useState<{ amount: number; message: string } | null>(null);

  const triggerCoinReward = (amount: number, message: string) => {
    addCoins(amount);
    setCoinRewardToast({ amount, message });
    setTimeout(() => setCoinRewardToast(null), 3000);
  };

  // Change active text helper
  const handlePickText = (text: TextItem) => {
    setInternalSelectedText(text);
    onSelectText(text);
  };

  // ================= GAME 1: AI LÀ NHÀ ĐỌC HIỂU? =================
  const [g1Mode, setG1Mode] = useState<'all' | 'single'>('all');
  const [g1Index, setG1Index] = useState(0);
  const [g1Timer, setG1Timer] = useState(20);
  const [g1Score, setG1Score] = useState(0);
  const [g1CoinsEarned, setG1CoinsEarned] = useState(0);
  const [g1Streak, setG1Streak] = useState(0);
  const [g1Selected, setG1Selected] = useState<string | null>(null);
  const [g1IsAnswered, setG1IsAnswered] = useState(false);
  const [g1Finished, setG1Finished] = useState(false);

  // Pool of multiple-choice questions
  const g1Questions = useMemo(() => {
    const list: { textTitle: string; q: any }[] = [];
    
    if (g1Mode === 'single' && activeText) {
      activeText.questions.filter(q => q.type === 'multiple-choice').forEach(q => {
        list.push({ textTitle: activeText.title, q });
      });
      // If single text doesn't have multiple choice questions, fallback to any question
      if (list.length === 0) {
        activeText.questions.forEach(q => {
          list.push({ textTitle: activeText.title, q });
        });
      }
    } else {
      // All texts in the grade
      texts.forEach(t => {
        t.questions.filter(q => q.type === 'multiple-choice').forEach(q => {
          list.push({ textTitle: t.title, q });
        });
      });
    }

    return list.slice(0, 10);
  }, [texts, g1Mode, activeText]);

  useEffect(() => {
    let interval: any = null;
    if (activeGame === 'quiz-master' && !g1IsAnswered && !g1Finished && g1Questions.length > 0) {
      interval = setInterval(() => {
        setG1Timer(prev => {
          if (prev <= 1) {
            setG1IsAnswered(true);
            setG1Streak(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, g1Index, g1IsAnswered, g1Finished, g1Questions]);

  const handleG1Answer = (option: string) => {
    if (g1IsAnswered) return;
    setG1Selected(option);
    setG1IsAnswered(true);

    const current = g1Questions[g1Index]?.q;
    if (current && option === current.correctAnswer) {
      const points = 20 + g1Timer * 2 + g1Streak * 5;
      const coins = 15 + Math.round(g1Timer / 2) + g1Streak * 2;
      setG1Score(prev => prev + points);
      setG1Streak(prev => prev + 1);
      setG1CoinsEarned(prev => prev + coins);
      addXP(points);
      triggerCoinReward(coins, `Trả lời đúng câu ${g1Index + 1}!`);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    } else {
      setG1Streak(0);
    }
  };

  const handleG1Next = () => {
    if (g1Index + 1 < g1Questions.length) {
      setG1Index(prev => prev + 1);
      setG1Timer(20);
      setG1Selected(null);
      setG1IsAnswered(false);
    } else {
      setG1Finished(true);
      const bonusCoins = 50;
      setG1CoinsEarned(prev => prev + bonusCoins);
      triggerCoinReward(bonusCoins, 'Thưởng hoàn thành toàn bộ vòng thi Đấu trí!');
      unlockBadge('quiz-master');
    }
  };

  const restartG1 = () => {
    setG1Index(0);
    setG1Timer(20);
    setG1Score(0);
    setG1CoinsEarned(0);
    setG1Streak(0);
    setG1Selected(null);
    setG1IsAnswered(false);
    setG1Finished(false);
  };

  // ================= GAME 2: SẮP XẾP CÂU CHUYỆN =================
  const originalEvents = useMemo(() => {
    return getEventsForText(activeText);
  }, [activeText]);

  const [shuffledEvents, setShuffledEvents] = useState<string[]>([]);
  const [g2Checked, setG2Checked] = useState(false);
  const [g2IsCorrect, setG2IsCorrect] = useState(false);

  useEffect(() => {
    const copy = [...originalEvents];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledEvents(copy);
    setG2Checked(false);
    setG2IsCorrect(false);
  }, [activeText, originalEvents]);

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    if (g2Checked) return;
    const newEvents = [...shuffledEvents];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newEvents.length) return;
    [newEvents[index], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[index]];
    setShuffledEvents(newEvents);
  };

  const checkStoryOrder = () => {
    const isMatched = shuffledEvents.every((ev, idx) => ev === originalEvents[idx]);
    setG2Checked(true);
    setG2IsCorrect(isMatched);
    if (isMatched) {
      addXP(60);
      triggerCoinReward(50, 'Sắp xếp chuẩn xác sự kiện: +50 Xu 🪙');
      unlockBadge('word-detective');
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  // ================= GAME 3: TRUY TÌM TỪ KHÓA =================
  const keywordsList = useMemo(() => {
    return getKeywordsForText(activeText);
  }, [activeText]);

  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [g3Checked, setG3Checked] = useState(false);

  useEffect(() => {
    setSelectedKeywords([]);
    setG3Checked(false);
  }, [activeText]);

  const toggleKeyword = (w: string) => {
    if (g3Checked) return;
    setSelectedKeywords(prev => 
      prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]
    );
  };

  const checkKeywords = () => {
    setG3Checked(true);
    const correctTargetCount = keywordsList.filter(k => k.isCorrect).length;
    const userCorrectPicked = selectedKeywords.filter(w => {
      const target = keywordsList.find(k => k.word === w);
      return target?.isCorrect;
    }).length;

    if (userCorrectPicked >= correctTargetCount - 1 && userCorrectPicked > 0) {
      addXP(50);
      triggerCoinReward(40, 'Bắt trọn các từ khóa vàng: +40 Xu 🪙');
      unlockBadge('word-detective');
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
  };

  // ================= GAME 4: GIẢI MÃ THÔNG ĐIỆP =================
  const secretInfo = useMemo(() => {
    return getSecretMessageForText(activeText);
  }, [activeText]);

  const [g4Answer, setG4Answer] = useState('');
  const [g4Result, setG4Result] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    setG4Answer('');
    setG4Result(null);
  }, [activeText]);

  const cleanAnswer = secretInfo.answer.replace(/\s+/g, '').toUpperCase();

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGuess = g4Answer.trim().replace(/\s+/g, '').toUpperCase();
    if (cleanGuess === cleanAnswer) {
      setG4Result('success');
      addXP(70);
      triggerCoinReward(60, 'Mở khóa thông điệp thành công: +60 Xu 🪙');
      unlockBadge('word-detective');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } else {
      setG4Result('fail');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ================= HEADER BANNER ================= */}
      <div className="bg-gradient-to-r from-[#00A99D] via-[#008F85] to-[#1E65B5] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-yellow-300 backdrop-blur-xs">
            <Gamepad2 className="w-4 h-4" />
            <span>Đấu trường Trò chơi Văn học THCS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Góc trò chơi tương tác văn học
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 max-w-xl leading-relaxed">
            Hỗ trợ toàn bộ bài học và tác phẩm thuộc Lớp {texts[0]?.grade || 6}. Ôn luyện tư duy phản xạ, nắm vững cốt truyện và rèn giũa năng lực cảm thụ.
          </p>
        </div>

        {/* Current Grade Badge & Quick Work Info */}
        <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/25 text-xs space-y-2 min-w-[240px] shrink-0 relative z-10">
          <div className="flex items-center justify-between">
            <span className="font-bold text-yellow-300">Khối lớp hiện tại:</span>
            <span className="bg-white text-[#102A43] font-bold px-2 py-0.5 rounded-lg text-xs">
              Lớp {texts[0]?.grade || 6}
            </span>
          </div>
          <div className="pt-1 border-t border-white/20">
            <p className="text-white/80 text-[11px]">Tác phẩm đang chọn:</p>
            <p className="font-bold text-white text-xs truncate mt-0.5">
              {activeText.title}
            </p>
            <span className="inline-block mt-1 text-[10px] font-semibold bg-white/25 px-2 py-0.5 rounded text-white">
              {activeText.isPoem ? 'Thể thơ' : 'Văn xuôi / Truyện'} &bull; {activeText.unit}
            </span>
          </div>
        </div>
      </div>

      {/* ================= COIN BALANCE & REWARD STORE CTA ================= */}
      <div className="bg-gradient-to-r from-[#FFF8E7] via-[#FFF2D6] to-[#FFEBB5] rounded-3xl p-4 sm:p-5 text-[#102A43] shadow-xs flex flex-wrap items-center justify-between gap-3 border border-[#FCE1A8]">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs border border-[#FCE1A8]">
            🪙
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-bold text-[#102A43]">Tích Lũy Điểm Xu Thưởng</h2>
              <span className="text-xs bg-white font-bold text-[#C07D2B] px-2.5 py-0.5 rounded-full border border-[#FCE1A8] shadow-2xs">
                {user?.coins ?? 80} Xu trong ví
              </span>
            </div>
            <p className="text-[11px] text-[#61758A] font-medium">
              Hoàn thành các vòng chơi để nhận Xu đổi lấy Khung Avatar Hoa Sen, Rồng Vàng và Huy hiệu danh giá!
            </p>
          </div>
        </div>

        {onOpenRewardShop && (
          <button
            onClick={(e) => {
              createRipple(e);
              onOpenRewardShop();
            }}
            className="btn-primary-teal ripple-container inline-flex items-center space-x-2 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs transition-all cursor-pointer"
          >
            <span>🎁</span>
            <span>Mở Cửa Hàng Đổi Quà</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* ================= COMPREHENSIVE LESSON & WORK SELECTOR ================= */}
      <div className="bg-white rounded-3xl p-5 border border-[#E0EBF4] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E0EBF4] pb-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#00A99D]">
            <BookMarked className="w-4 h-4" />
            <span>Chọn Bài học & Tác phẩm để luyện tập ({texts.length} tác phẩm trong Lớp {texts[0]?.grade || 6})</span>
          </div>

          {onGoToReading && activeText && (
            <button
              onClick={() => onGoToReading(activeText)}
              className="text-xs text-[#00A99D] hover:text-[#008F85] font-bold flex items-center space-x-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Đọc lại tác phẩm này</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Unit Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
          <span className="text-[#61758A] shrink-0 text-xs font-bold flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Chủ đề / Bài học:</span>
          </span>

          <button
            onClick={() => setSelectedUnit('all')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              selectedUnit === 'all'
                ? 'bg-[#00A99D] text-white font-bold shadow-2xs'
                : 'bg-[#F4FAFF] text-[#61758A] hover:bg-[#E0EBF4]'
            }`}
          >
            Tất cả bài học ({texts.length})
          </button>

          {availableUnits.map((u, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedUnit(u)}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                selectedUnit === u
                  ? 'bg-[#00A99D] text-white font-bold shadow-2xs'
                  : 'bg-[#F4FAFF] text-[#61758A] hover:bg-[#E0EBF4]'
              }`}
            >
              {u}
            </button>
          ))}
        </div>

        {/* Works Grid / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTexts.map((t) => {
            const isSelected = activeText.id === t.id;

            return (
              <div
                key={t.id}
                onClick={(e) => {
                  createRipple(e);
                  handlePickText(t);
                }}
                className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#E0F8F3] border-[#00A99D] ring-2 ring-[#00A99D] shadow-sm'
                    : 'bg-white border-[#E0EBF4] hover:bg-[#F4FAFF] hover:border-[#00A99D]/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#61758A] truncate">
                      {t.unit}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.isPoem 
                        ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {t.isPoem ? 'Thơ' : 'Văn xuôi'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-[#102A43] line-clamp-1">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-[#61758A] truncate">
                    {t.authorOrSource}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#E0EBF4] flex items-center justify-between text-[11px]">
                  <span className="text-[#61758A]">
                    {t.questions.length} câu hỏi trắc nghiệm
                  </span>
                  {isSelected ? (
                    <span className="text-[#007F76] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Đang chọn</span>
                    </span>
                  ) : (
                    <span className="text-[#00A99D] font-semibold hover:underline">
                      Chọn bài này
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 4 GAME TABS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <button
          onClick={(e) => {
            createRipple(e);
            setActiveGame('quiz-master');
          }}
          className={`edu-card p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGame === 'quiz-master'
              ? 'bg-[#00A99D] text-white border-[#00A99D] shadow-xs scale-[1.02]'
              : 'bg-white text-[#102A43] border-[#E0EBF4] hover:border-[#00A99D]/40 hover:bg-[#F4FAFF]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Trophy className={`w-5 h-5 ${activeGame === 'quiz-master' ? 'text-white' : 'text-[#F2B544]'}`} />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeGame === 'quiz-master' ? 'bg-white/20 text-white' : 'bg-[#EAF6FF] text-[#3285E8]'}`}>Game 1</span>
          </div>
          <h3 className="font-bold text-sm">Ai là nhà đọc hiểu?</h3>
          <p className={`text-[11px] mt-1 ${activeGame === 'quiz-master' ? 'text-white/80' : 'text-[#61758A]'}`}>Đấu trí trắc nghiệm 20 giây</p>
        </button>

        <button
          onClick={(e) => {
            createRipple(e);
            setActiveGame('story-order');
          }}
          className={`edu-card p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGame === 'story-order'
              ? 'bg-[#00A99D] text-white border-[#00A99D] shadow-xs scale-[1.02]'
              : 'bg-white text-[#102A43] border-[#E0EBF4] hover:border-[#00A99D]/40 hover:bg-[#F4FAFF]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <ListOrdered className={`w-5 h-5 ${activeGame === 'story-order' ? 'text-white' : 'text-[#F2B544]'}`} />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeGame === 'story-order' ? 'bg-white/20 text-white' : 'bg-[#EAF6FF] text-[#3285E8]'}`}>Game 2</span>
          </div>
          <h3 className="font-bold text-sm">Sắp xếp câu chuyện</h3>
          <p className={`text-[11px] mt-1 ${activeGame === 'story-order' ? 'text-white/80' : 'text-[#61758A]'}`}>Phục hồi dòng sự kiện</p>
        </button>

        <button
          onClick={(e) => {
            createRipple(e);
            setActiveGame('keyword-hunt');
          }}
          className={`edu-card p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGame === 'keyword-hunt'
              ? 'bg-[#00A99D] text-white border-[#00A99D] shadow-xs scale-[1.02]'
              : 'bg-white text-[#102A43] border-[#E0EBF4] hover:border-[#00A99D]/40 hover:bg-[#F4FAFF]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Search className={`w-5 h-5 ${activeGame === 'keyword-hunt' ? 'text-white' : 'text-[#F2B544]'}`} />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeGame === 'keyword-hunt' ? 'bg-white/20 text-white' : 'bg-[#EAF6FF] text-[#3285E8]'}`}>Game 3</span>
          </div>
          <h3 className="font-bold text-sm">Truy tìm từ khóa</h3>
          <p className={`text-[11px] mt-1 ${activeGame === 'keyword-hunt' ? 'text-white/80' : 'text-[#61758A]'}`}>Bắt trọn ý nghĩa vàng</p>
        </button>

        <button
          onClick={(e) => {
            createRipple(e);
            setActiveGame('secret-decoder');
          }}
          className={`edu-card p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeGame === 'secret-decoder'
              ? 'bg-[#00A99D] text-white border-[#00A99D] shadow-xs scale-[1.02]'
              : 'bg-white text-[#102A43] border-[#E0EBF4] hover:border-[#00A99D]/40 hover:bg-[#F4FAFF]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <Key className={`w-5 h-5 ${activeGame === 'secret-decoder' ? 'text-white' : 'text-[#F2B544]'}`} />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeGame === 'secret-decoder' ? 'bg-white/20 text-white' : 'bg-[#FAF7F2] text-[#8B6426]'}`}>Game 4</span>
          </div>
          <h3 className="font-serif-academic font-bold text-sm">Giải mã thông điệp</h3>
          <p className={`text-[11px] mt-1 ${activeGame === 'secret-decoder' ? 'text-[#A6A29A]' : 'text-[#77736D]'}`}>Tìm mật mã nhân văn</p>
        </button>
      </div>

      {/* ================= GAME 1 DISPLAY: AI LÀ NHÀ ĐỌC HIỂU ================= */}
      {activeGame === 'quiz-master' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBF4] shadow-xs space-y-6">
          {/* Mode Switcher: Liên bài vs Tác phẩm đang chọn */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0EBF4] pb-4">
            <div className="flex items-center space-x-2 text-xs font-semibold">
              <span className="text-[#61758A]">Chế độ câu hỏi:</span>
              <button
                onClick={() => {
                  setG1Mode('all');
                  restartG1();
                }}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  g1Mode === 'all'
                    ? 'bg-[#00A99D] text-white font-bold shadow-2xs'
                    : 'bg-[#F4FAFF] text-[#61758A] hover:bg-[#E0EBF4]'
                }`}
              >
                Toàn khối Lớp {texts[0]?.grade || 6}
              </button>
              <button
                onClick={() => {
                  setG1Mode('single');
                  restartG1();
                }}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  g1Mode === 'single'
                    ? 'bg-[#00A99D] text-white font-bold shadow-2xs'
                    : 'bg-[#F4FAFF] text-[#61758A] hover:bg-[#E0EBF4]'
                }`}
              >
                Chuyên sâu: {activeText.title}
              </button>
            </div>

            <span className="text-xs text-[#61758A]">
              Tổng số câu trắc nghiệm: {g1Questions.length} câu
            </span>
          </div>

          {g1Finished ? (
            <div className="text-center py-8 space-y-4">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-[#102A43]">
                Chúc mừng Nhà Đọc Hiểu Xuất Sắc!
              </h2>
              <p className="text-sm text-[#61758A]">
                Em đã đạt được <span className="text-[#00A99D] font-extrabold">{g1Score} Điểm</span> trong phần thi đấu trí!
              </p>
              <div className="inline-flex items-center space-x-2 bg-[#FFF8E7] border border-[#FCE1A8] px-4 py-2 rounded-2xl text-[#C07D2B] font-extrabold text-sm shadow-2xs">
                <span className="text-xl">🪙</span>
                <span>+{g1CoinsEarned} Xu Thưởng đã được tích lũy vào ví!</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={restartG1}
                  className="btn-primary-teal inline-flex items-center space-x-2 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại vòng mới</span>
                </button>
                {onOpenRewardShop && (
                  <button
                    onClick={onOpenRewardShop}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 px-5 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>🎁 Đến Cửa Hàng Đổi Quà</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : g1Questions.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <HelpCircle className="w-12 h-12 text-[#61758A] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#102A43]">Chưa có câu hỏi trắc nghiệm cho tác phẩm này</p>
              <p className="text-xs text-[#61758A]">Em hãy chuyển sang chế độ "Toàn khối lớp" hoặc chọn tác phẩm khác để thi tài nhé.</p>
              <button
                onClick={() => setG1Mode('all')}
                className="btn-primary-teal text-xs px-4 py-2 rounded-xl"
              >
                Chuyển sang Toàn khối lớp
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Top timer & score bar */}
              <div className="flex items-center justify-between border-b border-[#E0EBF4] pb-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#61758A]">
                  <span>Câu {g1Index + 1}/{g1Questions.length}</span>
                  <span>&bull;</span>
                  <span className="text-[#00A99D] truncate max-w-[200px]">
                    {g1Questions[g1Index]?.textTitle}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Streak */}
                  {g1Streak > 1 && (
                    <div className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg text-xs font-black border border-orange-200 animate-bounce">
                      <Flame className="w-4 h-4 fill-orange-500" />
                      <span>x{g1Streak} Combo</span>
                    </div>
                  )}

                  {/* Countdown Timer */}
                  <div className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-black border ${
                    g1Timer <= 5 ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' : 'bg-[#E0F8F3] text-[#007F76] border-[#BDE8E0]'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>{g1Timer}s</span>
                  </div>

                  {/* Total Score & Coins */}
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black text-[#102A43] bg-[#F4FAFF] px-2.5 py-1 rounded-xl border border-[#E0EBF4]">
                      {g1Score} Điểm
                    </span>
                    <span className="text-xs font-black text-[#C07D2B] bg-[#FFF8E7] border border-[#FCE1A8] px-2.5 py-1 rounded-xl flex items-center space-x-1 shadow-2xs">
                      <span>🪙</span>
                      <span>+{g1CoinsEarned}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Question prompt */}
              <h3 className="text-base sm:text-lg font-bold text-[#102A43] leading-snug">
                {g1Questions[g1Index]?.q.prompt}
              </h3>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {g1Questions[g1Index]?.q.options?.map((opt: string, idx: number) => {
                  const isCorrect = opt === g1Questions[g1Index]?.q.correctAnswer;
                  const isSelected = g1Selected === opt;

                  let style = 'bg-[#F4FAFF] border-[#E0EBF4] text-[#102A43] hover:bg-[#E0F8F3] hover:border-[#00A99D]/50';
                  if (g1IsAnswered) {
                    if (isCorrect) {
                      style = 'bg-[#E0F8F3] border-[#00A99D] text-[#007F76] font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-50 border-rose-300 text-rose-800 line-through';
                    } else {
                      style = 'bg-[#F4FAFF] border-[#E0EBF4] text-[#A0B2C6] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={g1IsAnswered}
                      onClick={() => handleG1Answer(opt)}
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-start space-x-3 cursor-pointer ${style}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-white border border-[#E0EBF4] text-[#102A43] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 mt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation after answered */}
              {g1IsAnswered && (
                <div className="p-4 bg-[#F4FAFF] rounded-2xl border border-[#E0EBF4] text-xs text-[#334E68] space-y-1 animate-in fade-in">
                  <p className="font-bold text-[#102A43]">Giải thích chi tiết:</p>
                  <p>{g1Questions[g1Index]?.q.explanation}</p>
                </div>
              )}

              {/* Next button */}
              {g1IsAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleG1Next}
                    className="btn-primary-teal inline-flex items-center space-x-2 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <span>Câu tiếp theo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= GAME 2 DISPLAY: SẮP XẾP CÂU CHUYỆN ================= */}
      {activeGame === 'story-order' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBF4] shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-[#E0F8F3] text-[#007F76] font-bold px-2.5 py-0.5 rounded-md">
                Tác phẩm: {activeText.title}
              </span>
              <span className="text-xs text-[#61758A]">({activeText.unit})</span>
            </div>
            <h3 className="text-lg font-bold text-[#102A43]">
              Sắp xếp diễn biến tác phẩm: <span className="text-[#00A99D]">{activeText.title}</span>
            </h3>
            <p className="text-xs text-[#61758A]">
              Các chặng phát triển của tác phẩm đang bị xáo trộn. Hãy sử dụng mũi tên Lên/Xuống để sắp xếp theo đúng trình tự thời gian và diễn biến logic.
            </p>
          </div>

          <div className="space-y-2.5">
            {shuffledEvents.map((ev, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#F4FAFF] rounded-2xl border border-[#E0EBF4] flex items-center justify-between gap-3 transition-all hover:border-[#00A99D]/50"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-[#00A99D] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#102A43] leading-snug">
                    {ev}
                  </span>
                </div>

                {!g2Checked && (
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => moveEvent(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white border border-[#E0EBF4] text-[#61758A] hover:text-[#00A99D] disabled:opacity-30 cursor-pointer"
                      title="Di chuyển lên"
                    >
                      <MoveUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveEvent(idx, 'down')}
                      disabled={idx === shuffledEvents.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-[#E0EBF4] text-[#61758A] hover:text-[#00A99D] disabled:opacity-30 cursor-pointer"
                      title="Di chuyển xuống"
                    >
                      <MoveDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feedback */}
          {g2Checked && (
            <div className={`p-4 rounded-2xl border text-xs space-y-1 animate-in fade-in ${
              g2IsCorrect ? 'bg-[#E0F8F3] border-[#BDE8E0] text-[#007F76]' : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm">
                {g2IsCorrect ? <CheckCircle2 className="w-5 h-5 text-[#00A99D]" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                <span>{g2IsCorrect ? 'Chính xác hoàn hảo! Em nắm rất chắc mạch cảm xúc và cốt truyện (+60 XP, +50 Xu)' : 'Chưa chính xác lắm, hãy đổi lại vị trí các chặng nhé!'}</span>
              </div>
              <p>Trình tự đúng giúp người đọc nắm vững diễn biến tâm lý nhân vật và vẻ đẹp nghệ thuật của tác phẩm.</p>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end space-x-3">
            {!g2Checked ? (
              <button
                onClick={checkStoryOrder}
                className="btn-primary-teal text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Kiểm tra thứ tự câu chuyện
              </button>
            ) : (
              <button
                onClick={() => setG2Checked(false)}
                className="bg-[#F4FAFF] hover:bg-[#E0EBF4] text-[#102A43] px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Sắp xếp lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= GAME 3 DISPLAY: TRUY TÌM TỪ KHÓA ================= */}
      {activeGame === 'keyword-hunt' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBF4] shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-[#E0F8F3] text-[#007F76] font-bold px-2.5 py-0.5 rounded-md">
                Tác phẩm: {activeText.title}
              </span>
              <span className="text-xs text-[#61758A]">({activeText.unit})</span>
            </div>
            <h3 className="text-lg font-bold text-[#102A43]">
              Truy tìm từ khóa vàng: <span className="text-[#00A99D]">{activeText.title}</span>
            </h3>
            <p className="text-xs text-[#61758A]">
              Đọc đoạn trích dưới đây và bấm chọn những từ ngữ mang ý nghĩa biểu tượng, phẩm chất cốt lõi hoặc biện pháp tu từ then chốt.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#EDE4D6] text-xs sm:text-sm text-[#2C2115] leading-relaxed font-serif-academic italic">
            "{activeText.excerpt}"
          </div>

          {/* Keywords choices */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-[#102A43]">Bấm chọn các từ khóa trọng tâm của tác phẩm:</p>
            <div className="flex flex-wrap gap-2">
              {keywordsList.map((kw, kIdx) => {
                const isSelected = selectedKeywords.includes(kw.word);
                let style = 'bg-[#F4FAFF] border-[#E0EBF4] text-[#102A43] hover:border-[#00A99D]/60';

                if (g3Checked) {
                  if (kw.isCorrect) {
                    style = 'bg-[#E0F8F3] border-[#00A99D] text-[#007F76] font-bold';
                  } else if (isSelected && !kw.isCorrect) {
                    style = 'bg-rose-100 border-rose-300 text-rose-800 line-through';
                  }
                } else if (isSelected) {
                  style = 'bg-[#00A99D] text-white border-[#00A99D] font-bold shadow-2xs';
                }

                return (
                  <button
                    key={kIdx}
                    onClick={() => toggleKeyword(kw.word)}
                    className={`px-4 py-2 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${style}`}
                  >
                    {kw.word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation after checked */}
          {g3Checked && (
            <div className="p-4 bg-[#F4FAFF] rounded-2xl border border-[#E0EBF4] space-y-2 text-xs animate-in fade-in">
              <p className="font-bold text-[#102A43]">Giải nghĩa các từ khóa vàng:</p>
              <ul className="space-y-1 text-[#334E68]">
                {keywordsList.map((kw, idx) => (
                  <li key={idx}>
                    <strong className="text-[#00A99D]">{kw.word}:</strong> {kw.explanation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            {!g3Checked ? (
              <button
                onClick={checkKeywords}
                disabled={selectedKeywords.length === 0}
                className="btn-primary-teal text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                Xác nhận từ khóa đã chọn
              </button>
            ) : (
              <button
                onClick={() => { setG3Checked(false); setSelectedKeywords([]); }}
                className="bg-[#F4FAFF] hover:bg-[#E0EBF4] text-[#102A43] px-5 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Chơi lại
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================= GAME 4 DISPLAY: GIẢI MÃ THÔNG ĐIỆP ================= */}
      {activeGame === 'secret-decoder' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E0EBF4] shadow-xs space-y-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-[#E0F8F3] text-[#007F76] font-bold px-2.5 py-0.5 rounded-md">
                Tác phẩm: {activeText.title}
              </span>
              <span className="text-xs text-[#61758A]">({activeText.unit})</span>
            </div>
            <h3 className="text-lg font-bold text-[#102A43]">
              Giải mã thông điệp ẩn giấu: <span className="text-[#00A99D]">{activeText.title}</span>
            </h3>
            <p className="text-xs text-[#61758A]">
              Đọc gợi ý của Trợ lý AI và giải mã từ khóa mật mang thông điệp đạo đức lớn nhất của tác phẩm.
            </p>
          </div>

          <div className="p-4 bg-[#FFF8E7] rounded-2xl border border-[#FCE1A8] text-xs sm:text-sm text-[#8B6426] space-y-2">
            <div className="flex items-center space-x-2 font-bold text-[#C07D2B]">
              <Key className="w-4 h-4" />
              <span>Gợi ý manh mối:</span>
            </div>
            <p className="leading-relaxed font-medium">"{secretInfo.clue}"</p>
            <div className="pt-1 flex items-center space-x-2 text-xs text-[#61758A]">
              <span className="font-bold text-[#102A43]">Mật mã gợi ý:</span>
              <span className="tracking-widest font-mono bg-white px-2.5 py-1 rounded-lg border border-[#FCE1A8] font-bold text-[#C07D2B] shadow-2xs">
                {secretInfo.encoded}
              </span>
            </div>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleGuessSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#102A43] mb-1">
                Nhập đáp án thông điệp giải mã được:
              </label>
              <input
                type="text"
                value={g4Answer}
                onChange={(e) => setG4Answer(e.target.value)}
                placeholder="ví dụ: KHIÊM TỐN, TÌNH BẠN, LÒNG NHÂN ÁI..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E0EBF4] focus:outline-none focus:ring-2 focus:ring-[#00A99D] font-bold uppercase tracking-wider bg-[#F4FAFF]"
              />
            </div>

            <button
              type="submit"
              className="btn-primary-teal text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Mở khóa mật mã (+70 XP, +60 Xu)
            </button>
          </form>

          {/* Feedback */}
          {g4Result === 'success' && (
            <div className="p-4 bg-[#E0F8F3] rounded-2xl border border-[#BDE8E0] text-xs text-[#007F76] space-y-1.5 animate-in fade-in">
              <div className="flex items-center space-x-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#00A99D]" />
                <span>Chúc mừng em đã giải mã thành công: "{secretInfo.answer}"!</span>
              </div>
              <p className="text-xs text-[#007F76] leading-relaxed">
                {secretInfo.meaning}
              </p>
            </div>
          )}

          {g4Result === 'fail' && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800 space-y-1 animate-in fade-in">
              <p className="font-bold">Mật mã chưa khớp!</p>
              <p>Hãy đối chiếu kỹ từng chữ cái trong phần mật mã gợi ý phía trên nhé.</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Coin Toast */}
      {coinRewardToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#102A43] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-amber-400/40 animate-scale-up">
          <span className="text-2xl animate-bounce">🪙</span>
          <div>
            <p className="text-xs text-amber-300 font-bold">+{coinRewardToast.amount} Xu Thưởng!</p>
            <p className="text-[11px] text-white/80">{coinRewardToast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};
