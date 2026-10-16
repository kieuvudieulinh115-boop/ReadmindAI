import React, { useState, useEffect, useRef } from 'react';
import { TextItem, VocabularyItem } from '../types';
import { getPoemAnalysis } from '../data/poetryKnowledge';
import { 
  BookOpen, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Type, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  HelpCircle, 
  Feather, 
  Music, 
  Compass, 
  Heart, 
  Layers, 
  Eye, 
  Info,
  ChevronRight,
  Bookmark,
  Loader2
} from 'lucide-react';
import { createRipple } from '../utils/interactiveEffects';

interface PoetryReaderProps {
  text: TextItem;
  onGoToQuiz: () => void;
  onSelectWord?: (vocab: VocabularyItem) => void;
}

export const PoetryReader: React.FC<PoetryReaderProps> = ({
  text,
  onGoToQuiz,
  onSelectWord
}) => {
  // Mode: 'reading' (Đọc nguyên tác - Mặc định) or 'analysis' (Phân tích & Cảm thụ)
  const [mode, setMode] = useState<'reading' | 'analysis'>('reading');

  // Font size: 'normal' (19px), 'large' (21px), 'xlarge' (24px)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Focus mode (ẩn bớt các chi tiết xung quanh, toàn tâm vào trang thơ)
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Guide rhythm indicator (Hiển thị ngắt nhịp thanh nhã)
  const [showRhythmMarks, setShowRhythmMarks] = useState(false);

  // Interactive selected line / stanza for analysis mode
  const [selectedStanzaIndex, setSelectedStanzaIndex] = useState<number>(0);
  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);

  // Audio / TTS State - Standard Northern Vietnamese Female Voice (Hà Nội chuẩn)
  const [voiceType, setVoiceType] = useState<'ai-female-hanoi' | 'browser-female-hanoi'>('ai-female-hanoi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [activeSpeakingLineIdx, setActiveSpeakingLineIdx] = useState<number>(-1);
  const [activeSpeakingStanzaIdx, setActiveSpeakingStanzaIdx] = useState<number>(-1);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const aiAudioRef = useRef<HTMLAudioElement | null>(null);
  const aiTTSFailedRef = useRef<boolean>(false);
  const [systemViVoices, setSystemViVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Analysis data computed for this poem
  const analysis = React.useMemo(() => getPoemAnalysis(text), [text]);

  // Clean lines for TTS and line tracking
  const allLines = React.useMemo(() => {
    return text.content.split('\n');
  }, [text.content]);

  // Split content into stanzas
  const stanzas = React.useMemo(() => {
    const rawStanzas: { lines: { text: string; globalIdx: number }[] }[] = [];
    let current: { text: string; globalIdx: number }[] = [];

    allLines.forEach((l, idx) => {
      if (l.trim().length === 0) {
        if (current.length > 0) {
          rawStanzas.push({ lines: current });
          current = [];
        }
      } else {
        current.push({ text: l, globalIdx: idx });
      }
    });

    if (current.length > 0) {
      rawStanzas.push({ lines: current });
    }

    return rawStanzas;
  }, [allLines]);

  // Setup synth & discover Vietnamese voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const scanVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const viOnly = voices.filter(v => 
          v.lang.toLowerCase().startsWith('vi') || 
          v.name.toLowerCase().includes('vietnam') || 
          v.lang.toLowerCase().includes('vn')
        );
        setSystemViVoices(viOnly);
      };

      scanVoices();
      window.speechSynthesis.onvoiceschanged = scanVoices;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (aiAudioRef.current) {
        aiAudioRef.current.pause();
        aiAudioRef.current.src = '';
        aiAudioRef.current = null;
      }
    };
  }, []);

  // Helper to find best Northern/Hanoi female voice in browser
  const getBestHanoiFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    const viVoices = voices.filter(v => 
      v.lang.toLowerCase().startsWith('vi') || 
      v.name.toLowerCase().includes('vietnam') || 
      v.lang.toLowerCase().includes('vn')
    );

    if (viVoices.length === 0) return null;

    // Prioritize Hanoi / Northern female voices:
    // 1. Microsoft HoaiMy (Microsoft Edge / Windows authentic Hanoi female)
    // 2. Google Tiếng Việt (Google Chrome standard Hanoi female)
    // 3. Apple Linh / Mai (macOS/iOS vi-VN female)
    // 4. Any female voice (female, nu, nữ, ngoc, loan, anh)
    const hoaiMy = viVoices.find(v => /hoaimy/i.test(v.name));
    if (hoaiMy) return hoaiMy;

    const googleVi = viVoices.find(v => /google/i.test(v.name) && /tiếng việt|vietnamese/i.test(v.name));
    if (googleVi) return googleVi;

    const femaleVi = viVoices.find(v => /linh|mai|nữ|nu|female|ngoc|anh|loan|thao|huong/i.test(v.name));
    if (femaleVi) return femaleVi;

    return viVoices[0];
  };

  // 1. Play AI Hanoi Female Voice (Gemini TTS standard Northern accent)
  const handlePlayPoemAI = async (startStanzaIdx = 0) => {
    handleStopPoem();
    setIsLoadingAudio(true);
    setVoiceNotice(null);

    if (startStanzaIdx >= stanzas.length) {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
      setActiveSpeakingLineIdx(-1);
      setActiveSpeakingStanzaIdx(-1);
      return;
    }

    const currentStanza = stanzas[startStanzaIdx];
    const stanzaText = currentStanza.lines.map(l => l.text).join('\n');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: stanzaText,
          voiceName: 'Aoede', // Gentle melodious Hanoi female tone
          style: 'Giọng nữ cô giáo dạy Ngữ văn tại Hà Nội, phát âm chuẩn tiếng Việt Bắc Bộ, truyền cảm, nhẹ nhàng, ấm áp, ngâm thơ và đọc diễn cảm các tác phẩm thơ ca THCS chuẩn nhịp điệu.'
        })
      });

      if (!res.ok) {
        aiTTSFailedRef.current = true;
        setVoiceNotice('Đang phát bằng bộ đọc thiết bị (Hạn mức giọng AI hôm nay tạm hết hoặc đang bận).');
        handlePlayPoemBrowser(startStanzaIdx);
        return;
      }

      const data = await res.json();
      if (data.quotaExceeded || !data.audioBase64) {
        aiTTSFailedRef.current = true;
        setVoiceNotice('Đang phát bằng bộ đọc thiết bị (Hạn mức giọng AI hôm nay tạm hết hoặc đang bận).');
        handlePlayPoemBrowser(startStanzaIdx);
        return;
      }

      const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
      audio.playbackRate = 0.94; // Lyrical reading pace

      audio.onplay = () => {
        setIsPlayingAudio(true);
        setIsPausedAudio(false);
        setActiveSpeakingStanzaIdx(startStanzaIdx);
        if (currentStanza.lines.length > 0) {
          setActiveSpeakingLineIdx(currentStanza.lines[0].globalIdx);
        }
      };

      audio.ontimeupdate = () => {
        if (audio.duration > 0 && currentStanza.lines.length > 1) {
          const ratio = audio.currentTime / audio.duration;
          const lineOffset = Math.min(
            currentStanza.lines.length - 1,
            Math.floor(ratio * currentStanza.lines.length)
          );
          setActiveSpeakingLineIdx(currentStanza.lines[lineOffset].globalIdx);
        }
      };

      audio.onended = () => {
        const nextStanza = startStanzaIdx + 1;
        if (nextStanza < stanzas.length) {
          setTimeout(() => {
            handlePlayPoemAI(nextStanza);
          }, 700);
        } else {
          setIsPlayingAudio(false);
          setIsPausedAudio(false);
          setActiveSpeakingLineIdx(-1);
          setActiveSpeakingStanzaIdx(-1);
        }
      };

      audio.onerror = () => {
        aiTTSFailedRef.current = true;
        handlePlayPoemBrowser(startStanzaIdx);
      };

      aiAudioRef.current = audio;
      await audio.play();
    } catch {
      aiTTSFailedRef.current = true;
      setVoiceNotice('Đang phát bằng bộ đọc thiết bị (Hạn mức giọng AI hôm nay tạm hết hoặc đang bận).');
      handlePlayPoemBrowser(startStanzaIdx);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // 2. Play Browser SpeechSynthesis Voice strictly with Vietnamese Female Voice
  const handlePlayPoemBrowser = (startStanzaIdx = 0) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const hanoiVoice = getBestHanoiFemaleVoice();

    // If client device has NO specific Vietnamese voice installed:
    // Only attempt AI once if AI hasn't failed yet
    if (!hanoiVoice) {
      if (!aiTTSFailedRef.current) {
        setVoiceNotice('Thiết bị của bạn chưa cài gói giọng tiếng Việt. Đang chuyển sang Giọng Nữ Hà Nội (AI Chuẩn) để đọc đúng ngữ âm tiếng Việt.');
        setVoiceType('ai-female-hanoi');
        handlePlayPoemAI(startStanzaIdx);
        return;
      }
      setVoiceNotice('Đang đọc bằng bộ phát âm tiếng Việt (vi-VN) của hệ thống.');
    }

    if (startStanzaIdx >= stanzas.length) {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
      setActiveSpeakingLineIdx(-1);
      setActiveSpeakingStanzaIdx(-1);
      return;
    }

    const currentStanza = stanzas[startStanzaIdx];
    let lineIdxInStanza = 0;

    const speakLineInStanza = (lIdx: number) => {
      if (lIdx >= currentStanza.lines.length) {
        // Finished current stanza, advance to next
        const nextStanza = startStanzaIdx + 1;
        if (nextStanza < stanzas.length) {
          setTimeout(() => {
            handlePlayPoemBrowser(nextStanza);
          }, 850);
        } else {
          setIsPlayingAudio(false);
          setIsPausedAudio(false);
          setActiveSpeakingLineIdx(-1);
          setActiveSpeakingStanzaIdx(-1);
        }
        return;
      }

      const lineObj = currentStanza.lines[lIdx];
      setActiveSpeakingStanzaIdx(startStanzaIdx);
      setActiveSpeakingLineIdx(lineObj.globalIdx);

      const utterance = new SpeechSynthesisUtterance(lineObj.text);
      if (hanoiVoice) {
        utterance.voice = hanoiVoice; // STRICTLY VIETNAMESE FEMALE
      }
      utterance.lang = 'vi-VN';
      utterance.rate = 0.86; // Lyrical poetic pacing
      utterance.pitch = 1.06; // Sweet, bright female pitch

      utterance.onend = () => {
        setTimeout(() => {
          speakLineInStanza(lIdx + 1);
        }, 400);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActiveSpeakingLineIdx(-1);
        setActiveSpeakingStanzaIdx(-1);
      };

      utteranceRef.current = utterance;
      synthRef.current?.speak(utterance);
    };

    setIsPlayingAudio(true);
    setIsPausedAudio(false);
    speakLineInStanza(0);
  };

  // Main playback controls
  const handlePlayPoem = (stanzaIdx = 0) => {
    if (voiceType === 'ai-female-hanoi') {
      handlePlayPoemAI(stanzaIdx);
    } else {
      handlePlayPoemBrowser(stanzaIdx);
    }
  };

  const handlePausePoem = () => {
    if (aiAudioRef.current && isPlayingAudio) {
      aiAudioRef.current.pause();
      setIsPausedAudio(true);
    } else if (synthRef.current && isPlayingAudio) {
      synthRef.current.pause();
      setIsPausedAudio(true);
    }
  };

  const handleResumePoem = () => {
    if (aiAudioRef.current && isPausedAudio) {
      aiAudioRef.current.play();
      setIsPausedAudio(false);
    } else if (synthRef.current && isPausedAudio) {
      synthRef.current.resume();
      setIsPausedAudio(false);
    } else {
      handlePlayPoem(0);
    }
  };

  const handleStopPoem = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (aiAudioRef.current) {
      aiAudioRef.current.pause();
      aiAudioRef.current.src = '';
      aiAudioRef.current = null;
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    setIsLoadingAudio(false);
    setActiveSpeakingLineIdx(-1);
    setActiveSpeakingStanzaIdx(-1);
  };

  // Font size class mapping
  const fontSizeStyle = fontSize === 'normal' 
    ? 'text-[19px] sm:text-[20px] leading-[1.85]' 
    : fontSize === 'large' 
    ? 'text-[21px] sm:text-[22px] leading-[1.9]' 
    : 'text-[23px] sm:text-[25px] leading-[1.95]';

  // Format line with subtle poetic rhythm mark if enabled
  const renderLineText = (lineText: string, globalLineIdx: number) => {
    if (!showRhythmMarks) {
      return <span>{lineText}</span>;
    }

    // Gentle rhythm split: for 5-syllable, split 2/3 or 3/2; for 4-syllable 2/2; 7/8 syllable
    const words = lineText.trim().split(/\s+/);
    if (words.length === 5) {
      // 2/3 split
      return (
        <span>
          {words.slice(0, 2).join(' ')}
          <span className="text-amber-500/70 font-bold px-1 select-none text-[15px] italic">/</span>
          {words.slice(2).join(' ')}
        </span>
      );
    } else if (words.length === 4) {
      // 2/2 split
      return (
        <span>
          {words.slice(0, 2).join(' ')}
          <span className="text-amber-500/70 font-bold px-1 select-none text-[15px] italic">/</span>
          {words.slice(2).join(' ')}
        </span>
      );
    } else if (words.length === 6) {
      // 2/2/2 or 3/3 split
      return (
        <span>
          {words.slice(0, 2).join(' ')}
          <span className="text-amber-500/70 font-bold px-1 select-none text-[15px] italic">/</span>
          {words.slice(2, 4).join(' ')}
          <span className="text-amber-500/70 font-bold px-1 select-none text-[15px] italic">/</span>
          {words.slice(4).join(' ')}
        </span>
      );
    } else if (words.length === 8) {
      // 4/4 or 2/2/2/2 split
      return (
        <span>
          {words.slice(0, 4).join(' ')}
          <span className="text-amber-500/70 font-bold px-1 select-none text-[15px] italic">/</span>
          {words.slice(4).join(' ')}
        </span>
      );
    } else if (words.length === 7) {
      // 4/3 split
      return (
        <span>
          {words.slice(0, 4).join(' ')}
          <span className="text-amber-500/70 font-bold px-1 select-none text-[15px] italic">/</span>
          {words.slice(4).join(' ')}
        </span>
      );
    }

    return <span>{lineText}</span>;
  };

  const isExcerpt = text.isExcerpt || 
    text.title.toLowerCase().includes('trích') || 
    text.authorOrSource.toLowerCase().includes('trích') ||
    text.excerpt.toLowerCase().includes('trích');

  return (
    <div className={`transition-all duration-300 ${isFocusMode ? 'fixed inset-0 z-50 bg-[#FAF7F2] overflow-y-auto p-4 sm:p-8' : 'space-y-6'}`}>
      {/* ================= TOP CONTROLS & MODE SWITCHER ================= */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E0EBF4] shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Mode Switcher: Đọc nguyên tác vs Phân tích & Cảm thụ */}
        <div className="flex items-center bg-[#F4FAFF] p-1 rounded-xl border border-[#E0EBF4] text-xs font-bold">
          <button
            onClick={(e) => {
              createRipple(e);
              setMode('reading');
            }}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              mode === 'reading'
                ? 'bg-[#00A99D] text-white shadow-xs'
                : 'text-[#61758A] hover:text-[#102A43]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Đọc nguyên tác</span>
          </button>

          <button
            onClick={(e) => {
              createRipple(e);
              setMode('analysis');
            }}
            className={`px-3 sm:px-4 py-2 rounded-lg transition-all flex items-center space-x-1.5 cursor-pointer ${
              mode === 'analysis'
                ? 'bg-[#7C3AED] text-white shadow-xs'
                : 'text-[#61758A] hover:text-[#102A43]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phân tích & Cảm thụ</span>
          </button>
        </div>

        {/* Reading Tools Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {/* Rhythm Toggle */}
          <button
            onClick={() => setShowRhythmMarks(!showRhythmMarks)}
            className={`px-3 py-1.5 rounded-xl border transition-all flex items-center space-x-1.5 cursor-pointer ${
              showRhythmMarks
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-2xs font-bold'
                : 'bg-white text-[#61758A] border-[#E0EBF4] hover:bg-[#F4FAFF]'
            }`}
            title="Bật/tắt ký hiệu ngắt nhịp thơ nhẹ nhàng"
          >
            <Music className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">{showRhythmMarks ? 'Đang hiện ngắt nhịp' : 'Hướng dẫn ngắt nhịp'}</span>
          </button>

          {/* Font Size Adjuster */}
          <div className="flex items-center bg-[#F4FAFF] border border-[#E0EBF4] rounded-xl p-0.5">
            <span className="px-1.5 text-[11px] text-[#61758A] font-bold">Cỡ chữ:</span>
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${fontSize === 'normal' ? 'bg-[#00A99D] text-white font-bold' : 'text-[#61758A] hover:bg-white'}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${fontSize === 'large' ? 'bg-[#00A99D] text-white font-bold' : 'text-[#61758A] hover:bg-white'}`}
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${fontSize === 'xlarge' ? 'bg-[#00A99D] text-white font-bold' : 'text-[#61758A] hover:bg-white'}`}
            >
              A++
            </button>
          </div>

          {/* Voice Selector: Giọng Nữ Hà Nội */}
          <div className="flex items-center bg-[#F4FAFF] border border-[#E0EBF4] rounded-xl px-2 py-1 gap-1.5 shadow-2xs">
            <span className="text-[11px] font-bold text-[#61758A] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden md:inline">Giọng đọc:</span>
            </span>
            <select
              value={voiceType}
              onChange={(e) => {
                handleStopPoem();
                setVoiceType(e.target.value as any);
              }}
              className="bg-transparent text-xs font-bold text-[#102A43] focus:outline-none cursor-pointer pr-1"
              title="Chọn giọng đọc chuẩn tiếng Việt"
            >
              <option value="ai-female-hanoi">🌸 Cô giáo Hà Nội (AI Chuẩn)</option>
              <option value="browser-female-hanoi">🎧 Nữ Hà Nội (Thiết bị/Máy)</option>
            </select>
          </div>

          {/* Text-to-Speech Poetic Reading */}
          {isLoadingAudio ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center space-x-1.5 shadow-2xs animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Đang kết nối giọng đọc...</span>
            </div>
          ) : !isPlayingAudio ? (
            <button
              onClick={() => handlePlayPoem(0)}
              className="px-3.5 py-1.5 rounded-xl bg-[#00A99D] text-white hover:bg-[#008F85] transition-all flex items-center space-x-1.5 cursor-pointer font-bold shadow-xs active:scale-95"
              title="Nghe cô giáo đọc thơ diễn cảm bằng Giọng Nữ Hà Nội chuẩn"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Nghe đọc thơ</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 bg-[#E0F8F3] border border-[#BDE8E0] px-2.5 py-1 rounded-xl shadow-xs">
              <div className="text-[11px] font-bold text-[#007F76] pr-1 hidden sm:flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00A99D] animate-ping"></span>
                <span>{activeSpeakingStanzaIdx >= 0 ? `Khổ ${activeSpeakingStanzaIdx + 1}` : 'Đang đọc'}</span>
              </div>
              {isPausedAudio ? (
                <button
                  onClick={handleResumePoem}
                  className="p-1 rounded-lg text-[#00A99D] hover:bg-white transition-colors cursor-pointer"
                  title="Tiếp tục nghe"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={handlePausePoem}
                  className="p-1 rounded-lg text-[#00A99D] hover:bg-white transition-colors cursor-pointer"
                  title="Tạm dừng"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                </button>
              )}
              <button
                onClick={handleStopPoem}
                className="p-1 rounded-lg text-rose-600 hover:bg-white transition-colors cursor-pointer"
                title="Dừng đọc"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Focus Mode Toggle */}
          <button
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isFocusMode
                ? 'bg-[#102A43] text-white border-[#102A43]'
                : 'bg-white text-[#61758A] border-[#E0EBF4] hover:bg-[#F4FAFF]'
            }`}
            title={isFocusMode ? 'Thoát chế độ tập trung' : 'Chế độ tập trung (Tĩnh lặng đọc thơ)'}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Go to Quiz Shortcut */}
          <button
            onClick={onGoToQuiz}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer ml-auto"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Câu hỏi đọc hiểu</span>
          </button>
        </div>
      </div>

      {/* Voice Notification Banner */}
      {voiceNotice && (
        <div className="bg-amber-50/95 border border-amber-200 text-amber-900 rounded-2xl px-4 py-2.5 text-xs flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{voiceNotice}</span>
          </div>
          <button
            onClick={() => setVoiceNotice(null)}
            className="text-amber-700 hover:text-amber-900 font-bold px-2 py-0.5 rounded-lg hover:bg-amber-100 cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      )}

      {/* ================= MAIN CONTENT: BOOK PAGE LAYOUT ================= */}
      <div className={`transition-all duration-300 ${mode === 'analysis' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' : 'max-w-[760px] mx-auto'}`}>
        
        {/* POEM BOOK PAGE (Electronic Literary Page) */}
        <div className={`bg-[#FAF7F2] rounded-3xl border border-[#EDE4D6] shadow-sm p-6 sm:p-12 relative overflow-hidden ${
          mode === 'analysis' ? 'lg:col-span-7 xl:col-span-8' : 'w-full'
        }`}>
          {/* Subtle Book Spine & Watermark Ornament */}
          <div className="absolute top-0 left-0 bottom-0 w-2.5 bg-gradient-to-r from-[#D7C9B1] to-transparent pointer-events-none opacity-40"></div>
          <div className="absolute top-4 right-5 text-[#C4B59D]/30 pointer-events-none select-none">
            <Bookmark className="w-10 h-10 stroke-[1]" />
          </div>

          {/* A. THÔNG TIN TÁC PHẨM */}
          <div className="border-b border-[#E8DEC9] pb-6 mb-8 text-center space-y-3 relative z-10">
            {/* Badges: Thể thơ, Khối lớp, Trích đoạn */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#EFE7D8] text-[#6E5936] text-xs font-bold border border-[#DFD3BE]">
                {analysis.poeticForm}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#E0F8F3] text-[#007F76] text-xs font-bold border border-[#BDE8E0]">
                {text.unit} (Lớp {text.grade})
              </span>
              {isExcerpt && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                  Trích đoạn tác phẩm
                </span>
              )}
            </div>

            {/* Tên bài thơ (Modern Academic Serif) */}
            <h1 className="font-serif-academic text-2xl sm:text-4xl font-extrabold text-[#2C2115] tracking-tight">
              {text.title}
            </h1>

            {/* Tác giả & Nguồn xuất xứ */}
            <div className="space-y-1">
              <p className="font-serif-academic text-sm sm:text-base italic text-[#5C4D3C] font-semibold flex items-center justify-center space-x-1.5">
                <Feather className="w-4 h-4 text-[#C07D2B]" />
                <span>Tác giả: {text.authorOrSource}</span>
              </p>
              <p className="text-xs text-[#8A7965]">
                {analysis.sourceOrigin}
              </p>
            </div>
          </div>

          {/* B. NỘI DUNG BÀI THƠ (Hiển thị đầy đủ, đúng khổ, căn trái tao nhã, không cắt xén) */}
          <div className="relative z-10 max-w-[620px] mx-auto">
            {mode === 'analysis' && (
              <div className="mb-4 p-3 bg-purple-50/80 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  <strong>Chế độ Cảm thụ:</strong> Em có thể nhấp chuột vào bất kỳ khổ thơ hoặc câu thơ nào để xem phân tích nghệ thuật chi tiết bên phải.
                </span>
              </div>
            )}

            <div className="space-y-6 sm:space-y-7 font-serif-academic text-[#231B12]">
              {stanzas.map((stanza, sIdx) => {
                const isStanzaSelected = mode === 'analysis' && selectedStanzaIndex === sIdx;

                return (
                  <div
                    key={sIdx}
                    onClick={() => {
                      if (mode === 'analysis') {
                        setSelectedStanzaIndex(sIdx);
                        setSelectedLineIndex(null);
                      }
                    }}
                    className={`group p-3 sm:p-4 rounded-2xl transition-all ${
                      activeSpeakingStanzaIdx === sIdx
                        ? 'bg-[#FAF2E3]/80 ring-1 ring-amber-300/90 shadow-2xs'
                        : mode === 'analysis'
                        ? isStanzaSelected
                          ? 'bg-white/90 ring-2 ring-[#7C3AED] shadow-sm cursor-pointer'
                          : 'hover:bg-white/60 cursor-pointer'
                        : 'hover:bg-white/40'
                    }`}
                  >
                    {/* Stanza marker for reading vs analysis mode */}
                    {mode === 'reading' ? (
                      <div className="flex items-center justify-between mb-1 text-[11px] text-[#8A7965]">
                        <span className="font-serif-academic italic text-[12px] opacity-70">Khổ {sIdx + 1}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayPoem(sIdx);
                          }}
                          className="opacity-60 hover:opacity-100 px-2 py-0.5 rounded-lg text-[#007F76] hover:bg-[#E0F8F3] transition-all cursor-pointer font-bold inline-flex items-center space-x-1"
                          title="Nghe cô giáo đọc khổ thơ này bằng Giọng Nữ Hà Nội"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span className="hidden sm:inline">Nghe khổ này</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#E8DEC9] text-[11px] font-bold text-[#8A7965]">
                        <span>Khổ thơ {sIdx + 1}</span>
                        {isStanzaSelected && (
                          <span className="text-[#7C3AED] flex items-center space-x-1">
                            <span>Đang chọn phân tích</span>
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    )}

                    {/* Stanza lines */}
                    <div className={`space-y-1 sm:space-y-1.5 ${fontSizeStyle}`}>
                      {stanza.lines.map((lineObj, lIdx) => {
                        const isSpeaking = activeSpeakingLineIdx === lineObj.globalIdx;
                        const isLineSelected = mode === 'analysis' && selectedLineIndex === lineObj.globalIdx;

                        return (
                          <div
                            key={lIdx}
                            onClick={(e) => {
                              if (mode === 'analysis') {
                                e.stopPropagation();
                                setSelectedStanzaIndex(sIdx);
                                setSelectedLineIndex(lineObj.globalIdx);
                              }
                            }}
                            className={`transition-colors rounded-lg px-2 py-0.5 ${
                              isSpeaking
                                ? 'bg-amber-200/90 font-bold text-[#102A43] ring-1 ring-amber-400/80 shadow-2xs'
                                : isLineSelected
                                ? 'bg-[#EDE7FE] text-[#4C1D95] font-semibold'
                                : ''
                            }`}
                          >
                            {renderLineText(lineObj.text, lineObj.globalIdx)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note footer */}
            <div className="mt-10 pt-6 border-t border-[#E8DEC9] flex flex-wrap items-center justify-between text-xs text-[#8A7965]">
              <span>Toàn văn bài thơ theo Chương trình GDPT 2018</span>
              <button
                onClick={onGoToQuiz}
                className="text-[#007F76] hover:text-[#005B54] font-bold inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>Luyện câu hỏi đọc hiểu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= CHẾ ĐỘ 2: BẢNG PHÂN TÍCH & CẢM THỤ (Bên cạnh văn bản) ================= */}
        {mode === 'analysis' && (
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 animate-fade-in">
            {/* Header Card: Central Theme & Main Message */}
            <div className="bg-white rounded-3xl p-5 border border-[#E0EBF4] shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                <Compass className="w-4 h-4" />
                <span>Chủ đề & Cảm xúc chủ đạo</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-[#F4FAFF] rounded-2xl border border-[#E0EBF4] space-y-1">
                  <span className="font-bold text-[#102A43] flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>Cảm xúc & Giọng điệu:</span>
                  </span>
                  <p className="text-[#334E68] italic font-serif-academic leading-relaxed">
                    {analysis.tone}
                  </p>
                </div>

                <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#EDE4D6] space-y-1">
                  <span className="font-bold text-[#102A43] flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Thông điệp tác phẩm:</span>
                  </span>
                  <p className="text-[#5C4D3C] font-serif-academic leading-relaxed">
                    {analysis.mainMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Stanza-by-Stanza Deep Analysis Box */}
            {analysis.stanzas && analysis.stanzas[selectedStanzaIndex] && (
              <div className="bg-white rounded-3xl p-5 border border-[#E0EBF4] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E0EBF4] pb-3">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#00A99D]">
                    <Layers className="w-4 h-4" />
                    <span>Cảm thụ Khổ thơ {selectedStanzaIndex + 1}</span>
                  </div>
                  <span className="text-[11px] bg-[#E0F8F3] text-[#007F76] font-bold px-2 py-0.5 rounded-full">
                    {analysis.stanzas[selectedStanzaIndex].lines.length} câu thơ
                  </span>
                </div>

                {/* Stanza Content summary */}
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#102A43]">Nội dung khổ thơ:</h4>
                  <p className="text-xs sm:text-sm text-[#334E68] leading-relaxed">
                    {analysis.stanzas[selectedStanzaIndex].summary}
                  </p>
                </div>

                {/* Rhythm & Cadence */}
                {analysis.stanzas[selectedStanzaIndex].rhythm && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#102A43] flex items-center space-x-1">
                      <Music className="w-3.5 h-3.5 text-amber-600" />
                      <span>Nhịp thơ & Âm hưởng:</span>
                    </h4>
                    <p className="text-xs text-[#334E68]">
                      {analysis.stanzas[selectedStanzaIndex].rhythm}
                    </p>
                  </div>
                )}

                {/* Rhetoric Devices */}
                {analysis.stanzas[selectedStanzaIndex].rhetoricDevices && analysis.stanzas[selectedStanzaIndex].rhetoricDevices!.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#102A43] flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Biện pháp tu từ đặc sắc:</span>
                    </h4>
                    <ul className="space-y-1 text-xs text-[#334E68]">
                      {analysis.stanzas[selectedStanzaIndex].rhetoricDevices!.map((dev, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5 bg-[#FAF7F2] p-2 rounded-xl border border-[#EDE4D6]">
                          <span className="text-[#00A99D] font-bold">•</span>
                          <span>{dev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Poetic Images */}
                {analysis.stanzas[selectedStanzaIndex].poeticImages && analysis.stanzas[selectedStanzaIndex].poeticImages!.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#102A43] flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-teal-600" />
                      <span>Hình ảnh thơ tiêu biểu:</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.stanzas[selectedStanzaIndex].poeticImages!.map((img, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-[#EAF6FF] text-[#1E65B5] text-[11px] font-semibold rounded-lg border border-[#C3E4FF]">
                          {img}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected line specific highlight note */}
                {selectedLineIndex !== null && (
                  <div className="p-3 bg-[#EDE7FE] rounded-2xl border border-[#DDD0FA] text-xs space-y-1 text-[#2E1065] animate-scale-up">
                    <p className="font-bold flex items-center space-x-1">
                      <span>Câu thơ được chọn:</span>
                    </p>
                    <p className="italic font-serif-academic font-medium">
                      "{allLines[selectedLineIndex]}"
                    </p>
                    <p className="text-[11px] text-[#4C1D95] pt-1">
                      Gợi ý cảm thụ: Hãy chú ý các từ ngữ gợi cảm xúc và cách tác giả tạo nhịp điệu tương phản giữa các hình tượng trong câu thơ này.
                    </p>
                  </div>
                )}

                {/* Stanza pagination buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-[#E0EBF4] text-xs">
                  <button
                    disabled={selectedStanzaIndex === 0}
                    onClick={() => {
                      setSelectedStanzaIndex(prev => Math.max(0, prev - 1));
                      setSelectedLineIndex(null);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[#E0EBF4] disabled:opacity-30 hover:bg-[#F4FAFF] cursor-pointer"
                  >
                    &larr; Khổ trước
                  </button>
                  <span className="text-[#61758A] font-bold">
                    Khổ {selectedStanzaIndex + 1}/{analysis.stanzas.length}
                  </span>
                  <button
                    disabled={selectedStanzaIndex === analysis.stanzas.length - 1}
                    onClick={() => {
                      setSelectedStanzaIndex(prev => Math.min(analysis.stanzas!.length - 1, prev + 1));
                      setSelectedLineIndex(null);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[#E0EBF4] disabled:opacity-30 hover:bg-[#F4FAFF] cursor-pointer"
                  >
                    Khổ sau &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
