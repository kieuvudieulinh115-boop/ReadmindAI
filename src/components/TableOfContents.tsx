import React, { useState } from 'react';
import { TextItem, Grade, Genre } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Feather, 
  Music,
  ArrowRight,
  HelpCircle,
  BookMarked,
  Clock
} from 'lucide-react';
import { ChillAudioPlayer } from './ChillAudioPlayer';
import { use3DTilt, createRipple } from '../utils/interactiveEffects';
import { getCoverImage } from '../data/coverImages';

interface TableOfContentsProps {
  texts: TextItem[];
  selectedGrade: Grade;
  setSelectedGrade: (grade: Grade) => void;
  onSelectText: (text: TextItem, initialAction?: 'read' | 'quiz' | 'voice') => void;
  onOpenAdmin: () => void;
}

const GENRE_LABELS: Record<Genre, { label: string; color: string; icon: string }> = {
  'truyen': { label: 'Truyện', color: 'bg-[#E0F8F3] text-[#007F76] border-[#B2EADF]', icon: '📖' },
  'tho': { label: 'Thơ ca', color: 'bg-[#FFF0F5] text-[#C41C5E] border-[#FFD0E2]', icon: '🌸' },
  'nghi-luan': { label: 'Nghị luận', color: 'bg-[#F1EBFF] text-[#6938D3] border-[#DDD0FA]', icon: '⚖️' },
  'thong-tin': { label: 'Thông tin / Kí', color: 'bg-[#EAF6FF] text-[#1E65B5] border-[#C3E4FF]', icon: '📰' },
  'ngu-ngon': { label: 'Ngụ ngôn / Hài', color: 'bg-[#E6F8EE] text-[#148348] border-[#B7EDCE]', icon: '🦊' },
  'khoa-hoc': { label: 'Khoa học', color: 'bg-[#E0F7FA] text-[#00838F] border-[#B2EBF2]', icon: '🔬' },
  'doi-song-moi-truong': { label: 'Môi trường', color: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]', icon: '🌱' }
};

/** Grade styling configuration for modern vibrant grade tabs */
const GRADE_CONFIG: Record<Grade, { label: string; bg: string; activeBg: string; text: string; iconColor: string; borderColor: string }> = {
  6: {
    label: 'Sách Lớp 6',
    bg: 'bg-[#EAF6FF]',
    activeBg: 'bg-[#3285E8] text-white shadow-md shadow-[#3285E8]/20',
    text: 'text-[#1E65B5]',
    iconColor: 'text-[#3285E8]',
    borderColor: 'border-[#C3E4FF]'
  },
  7: {
    label: 'Sách Lớp 7',
    bg: 'bg-[#FEF6E7]',
    activeBg: 'bg-[#F2B544] text-white shadow-md shadow-[#F2B544]/20',
    text: 'text-[#B47200]',
    iconColor: 'text-[#F2B544]',
    borderColor: 'border-[#FCE4B8]'
  },
  8: {
    label: 'Sách Lớp 8',
    bg: 'bg-[#FFF0F5]',
    activeBg: 'bg-[#E05285] text-white shadow-md shadow-[#E05285]/20',
    text: 'text-[#C41C5E]',
    iconColor: 'text-[#E05285]',
    borderColor: 'border-[#FFD0E2]'
  },
  9: {
    label: 'Sách Lớp 9',
    bg: 'bg-[#F1EBFF]',
    activeBg: 'bg-[#7C4DFF] text-white shadow-md shadow-[#7C4DFF]/20',
    text: 'text-[#6938D3]',
    iconColor: 'text-[#7C4DFF]',
    borderColor: 'border-[#DDD0FA]'
  }
};

/** Individual 3D Interactive Card with Cover Illustration - Modern Vibrant Dashboard */
const AcademicTextCard: React.FC<{
  text: TextItem;
  isCompleted: boolean;
  onSelect: (action: 'read') => void;
}> = ({ text, isCompleted, onSelect }) => {
  const cardRef = use3DTilt<HTMLDivElement>(4);
  const genreInfo = GENRE_LABELS[text.genre] || GENRE_LABELS['truyen'];
  const questionCount = text.questions?.length || 4;
  const coverUrl = getCoverImage(text);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      ref={cardRef}
      onClick={(e) => {
        createRipple(e);
        onSelect('read');
      }}
      className="edu-card spotlight-hover group rounded-2xl p-4 sm:p-5 border border-[#E0EBF4] bg-white flex flex-col sm:flex-row gap-4 sm:gap-4.5 justify-between relative shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#00A99D]/12 hover:border-[#00A99D]/40 cursor-pointer overflow-hidden"
    >
      {isCompleted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A99D] via-[#3285E8] to-[#00A99D] rounded-t-2xl z-20"></div>
      )}

      {/* LEFT: Cover Illustration (28-32% width on desktop, aspect-[3/4], rounded-[14px]) */}
      <div className="w-full sm:w-[30%] sm:max-w-[150px] md:max-w-[165px] shrink-0">
        <div className="relative aspect-[3/4] w-full h-44 sm:h-full rounded-[14px] overflow-hidden bg-gradient-to-br from-[#EAF6FF] to-[#E0F8F3] border border-[#E0EBF4]/80 shadow-2xs group-hover:shadow-md transition-shadow">
          <img
            src={coverUrl}
            alt={text.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 ${
              imgLoaded ? 'opacity-100' : 'opacity-90'
            }`}
          />
          {/* Subtle gradient overlay to enhance legibility and depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15 pointer-events-none"></div>

          {/* Top Grade badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="text-[10px] font-extrabold text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20 shadow-xs">
              Lớp {text.grade}
            </span>
          </div>

          {/* Bottom quick meta on cover */}
          <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between text-[10px] text-white/95 font-medium">
            <span className="flex items-center space-x-1 drop-shadow-sm font-semibold">
              <Clock className="w-3 h-3 text-[#F2B544]" />
              <span>~{text.estimatedReadMinutes}p</span>
            </span>
            {text.isPoem && (
              <span className="text-[9px] bg-white/30 backdrop-blur-sm px-1.5 py-0.5 rounded text-white font-bold drop-shadow-sm flex items-center">
                <Music className="w-2.5 h-2.5 mr-0.5 text-white" />
                Thơ
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Text Content & Action Button */}
      <div className="flex-1 flex flex-col justify-between space-y-2.5 min-w-0">
        <div className="space-y-2">
          {/* Category & Status Badges */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${genreInfo.color}`}>
                {genreInfo.icon} {genreInfo.label}
              </span>
              {text.isPoem && (
                <span className="text-[10px] font-bold text-[#3285E8] bg-[#EAF6FF] px-2 py-0.5 rounded-full border border-[#C3E4FF] flex items-center space-x-1">
                  <Music className="w-3 h-3 mr-0.5" />
                  <span>Thơ ngắt nhịp</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-semibold text-[#61758A] bg-[#F4FAFF] px-2 py-0.5 rounded-full border border-[#E0EBF4] flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-[#3285E8]" />
                <span>{questionCount} câu hỏi</span>
              </span>
              {isCompleted && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-0.5" />
                  <span>Đã học</span>
                </span>
              )}
            </div>
          </div>

          {/* Title and Author */}
          <div>
            <h3 
              className="text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#00A99D] transition-colors leading-snug line-clamp-1"
            >
              {text.title}
            </h3>
            <p className="text-xs text-[#61758A] font-medium flex items-center space-x-1.5 mt-1 line-clamp-1">
              <Feather className="w-3 h-3 text-[#00A99D] shrink-0" />
              <span>{text.authorOrSource}</span>
            </p>
          </div>

          {/* Excerpt */}
          <p className="text-xs text-[#61758A] line-clamp-2 leading-relaxed">
            {text.excerpt}
          </p>
        </div>

        {/* Action Button: Single Prominent Clean Button */}
        <div className="pt-2.5 mt-auto border-t border-[#E0EBF4]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              createRipple(e);
              onSelect('read');
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#00A99D] hover:bg-[#009388] text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2 ripple-container cursor-pointer group-hover:bg-[#009388]"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="truncate">Khám phá bài đọc & Câu hỏi</span>
            <ArrowRight className="w-4 h-4 ml-auto shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  texts,
  selectedGrade,
  setSelectedGrade,
  onSelectText,
  onOpenAdmin
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'all'>('all');

  // Filter texts by selected grade
  const gradeTexts = texts.filter(t => t.grade === selectedGrade);
  
  const filteredTexts = gradeTexts.filter(t => {
    const matchesGenre = selectedGenre === 'all' || t.genre === selectedGenre;
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.authorOrSource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  // Calculate completion progress for current grade
  const completedCount = gradeTexts.filter(t => user?.completedTextIds.includes(t.id)).length;
  const progressPercent = gradeTexts.length > 0 ? Math.round((completedCount / gradeTexts.length) * 100) : 0;

  // Group by Unit for clear curriculum organization with unique key guarantee
  const groupedByUnit = React.useMemo(() => {
    const groups: Record<string, TextItem[]> = {};
    const seenIds = new Set<string>();
    filteredTexts.forEach(t => {
      if (!t || !t.id || seenIds.has(t.id)) return;
      seenIds.add(t.id);
      const unitKey = t.unit || 'Bài học khác';
      if (!groups[unitKey]) groups[unitKey] = [];
      groups[unitKey].push(t);
    });
    return groups;
  }, [filteredTexts]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Modern Vibrant Hero Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#EAF6FF] via-white to-[#E0F8F3] border border-[#E0EBF4] p-5 sm:p-7 shadow-sm">
        {/* Subtle decorative background glow circles */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#00A99D]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 right-0 w-80 h-80 bg-[#3285E8]/8 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-[#00A99D]/30 px-3.5 py-1 rounded-full text-xs font-semibold text-[#007F76] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00A99D]" />
              <span>Sách giáo khoa Ngữ văn THCS &bull; Kết nối tri thức với cuộc sống</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#102A43] tracking-tight leading-snug">
              {user ? (
                <span>
                  Chào mừng <span className="text-[#F2B544] underline decoration-[#F2B544]/40 decoration-wavy underline-offset-4">{user.name}</span> ✨
                  <span className="block text-base sm:text-xl font-bold text-[#102A43] mt-1 font-sans">
                    Không gian đọc hiểu Ngữ văn <span className="text-[#00A99D]">Lớp {selectedGrade}</span>
                  </span>
                </span>
              ) : (
                <span>
                  Không gian đọc hiểu Ngữ văn <span className="text-[#00A99D]">Lớp {selectedGrade}</span>
                </span>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-[#61758A] leading-relaxed">
              Trải nghiệm đọc tác phẩm theo Chương trình GDPT 2018, luyện đọc diễn cảm, phát triển tư duy và khám phá những bài học nhân văn sâu sắc.
            </p>
          </div>

          {/* Right Banner Area: Student Progress Card & Audio Player */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Real student learning progress card */}
            <div className="bg-white/95 backdrop-blur-sm border border-[#E0EBF4] p-3.5 rounded-2xl shadow-xs space-y-2 w-full sm:w-auto min-w-[220px]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#61758A] font-medium flex items-center space-x-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-[#00A99D]" />
                  <span>Tiến độ học tập:</span>
                </span>
                <span className="font-extrabold text-[#102A43]">
                  {completedCount}/{gradeTexts.length} bài &bull; {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-[#EAF6FF] h-2.5 rounded-full overflow-hidden border border-[#D0E7FA]">
                <div 
                  className="bg-gradient-to-r from-[#00A99D] via-[#3285E8] to-[#F2B544] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <ChillAudioPlayer />
          </div>
        </div>
      </div>

      {/* Grade Selector Bar & Filters (Modern Container) */}
      <div className="bg-white rounded-[20px] p-4 sm:p-5 shadow-xs border border-[#E0EBF4] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Grade selection tabs with distinct pastel identity */}
          <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 sm:pb-0">
            {([6, 7, 8, 9] as Grade[]).map((g) => {
              const countInGrade = texts.filter(t => t.grade === g).length;
              const config = GRADE_CONFIG[g];
              const isSelected = selectedGrade === g;

              return (
                <button
                  key={g}
                  onClick={(e) => {
                    createRipple(e);
                    setSelectedGrade(g);
                  }}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center space-x-2 shrink-0 ripple-container cursor-pointer border ${
                    isSelected
                      ? config.activeBg + ' border-transparent'
                      : `${config.bg} ${config.text} ${config.borderColor} hover:brightness-95`
                  }`}
                >
                  <GraduationCap className={`w-4 h-4 ${isSelected ? 'text-white' : config.iconColor}`} />
                  <span>{config.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-white/80 ' + config.text
                  }`}>
                    {countInGrade}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="flex items-center space-x-2 flex-1 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#61758A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tác phẩm, tác giả..."
                className="w-full pl-9.5 pr-3 py-2 text-xs rounded-xl border border-[#E0EBF4] focus:outline-none focus:border-[#3285E8] focus:ring-2 focus:ring-[#3285E8]/15 bg-[#F4FAFF] text-[#102A43] placeholder-[#61758A] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Genre Tags Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto text-xs font-semibold pt-2 border-t border-[#E0EBF4]">
          <button
            onClick={(e) => {
              createRipple(e);
              setSelectedGenre('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all shrink-0 ripple-container cursor-pointer font-bold ${
              selectedGenre === 'all'
                ? 'bg-[#00A99D] text-white shadow-2xs'
                : 'bg-[#F4FAFF] text-[#61758A] hover:bg-[#EAF6FF] border border-[#E0EBF4]'
            }`}
          >
            Tất cả
          </button>
          {(Object.keys(GENRE_LABELS) as Genre[]).map((genreKey) => {
            const genreInfo = GENRE_LABELS[genreKey];
            const isSelected = selectedGenre === genreKey;
            return (
              <button
                key={genreKey}
                onClick={(e) => {
                  createRipple(e);
                  setSelectedGenre(genreKey);
                }}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 shrink-0 ripple-container cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-[#00A99D] text-white shadow-2xs font-bold border-transparent'
                    : 'bg-white text-[#61758A] border border-[#E0EBF4] hover:bg-[#F4FAFF]'
                }`}
              >
                <span>{genreInfo.icon}</span>
                <span>{genreInfo.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Units & Text Cards */}
      {filteredTexts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-[#E0EBF4] space-y-2">
          <BookMarked className="w-10 h-10 text-[#61758A] mx-auto opacity-40" />
          <h3 className="text-sm font-bold text-[#102A43]">Không tìm thấy bài đọc phù hợp</h3>
          <p className="text-xs text-[#61758A]">
            Thử tìm từ khóa khác hoặc chuyển sang thể loại khác.
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          {Object.entries(groupedByUnit).map(([unitName, unitTexts]) => (
            <div key={unitName} className="space-y-3.5">
              {/* Unit Header Label */}
              <div className="flex items-center space-x-2 border-b border-[#E0EBF4] pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A99D]"></span>
                <h2 className="text-sm sm:text-base font-bold text-[#102A43] tracking-tight">
                  {unitName}
                </h2>
                <span className="text-xs text-[#61758A] font-medium">({unitTexts.length} tác phẩm)</span>
              </div>

              {/* Grid of Texts: Exactly 2 cards per row on desktop (grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
                {unitTexts.map((text) => {
                  const isCompleted = user?.completedTextIds.includes(text.id);
                  return (
                    <AcademicTextCard
                      key={text.id}
                      text={text}
                      isCompleted={!!isCompleted}
                      onSelect={() => onSelectText(text, 'read')}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
