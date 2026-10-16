import React, { useState, useMemo } from 'react';
import { EssayPrompt, EssaySubmission, Grade } from '../types';
import { ESSAY_PROMPTS } from '../data/essayPrompts';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Search, 
  Sparkles, 
  GraduationCap, 
  Clock, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  BookOpen, 
  Filter, 
  History,
  PenTool,
  Flame,
  ArrowRight,
  TrendingUp,
  Share2,
  X
} from 'lucide-react';
import { createRipple } from '../utils/interactiveEffects';

interface ExamCenterProps {
  selectedGrade: Grade;
  setSelectedGrade: (grade: Grade) => void;
  onStartExam: (prompt: EssayPrompt) => void;
}

export const ExamCenter: React.FC<ExamCenterProps> = ({
  selectedGrade,
  setSelectedGrade,
  onStartExam
}) => {
  const { user } = useAuth();

  // Active Sub-tab in Exam Center
  const [activeSubTab, setActiveSubTab] = useState<'social' | 'literary' | 'history'>('social');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('Tất cả');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Tất cả');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');

  // Selected Submission Modal for viewing review
  const [viewingSubmission, setViewingSubmission] = useState<EssaySubmission | null>(null);

  // Topics for Social Argumentation
  const socialTopics = [
    'Tất cả',
    'Lòng biết ơn',
    'Tình yêu thương',
    'Tinh thần trách nhiệm',
    'Sự trung thực',
    'Nghị lực vượt khó',
    'Bạo lực học đường',
    'Văn hóa ứng xử trên mạng xã hội',
    'Bảo vệ môi trường',
    'Ý thức tự học',
    'Sử dụng công nghệ và trí tuệ nhân tạo'
  ];

  // Map of student's completed essays
  const completedPromptMap = useMemo(() => {
    const map = new Map<string, EssaySubmission>();
    if (user?.essaySubmissions) {
      user.essaySubmissions.forEach(sub => {
        // Keep highest or latest
        if (!map.has(sub.promptId) || (map.get(sub.promptId)?.grading.score || 0) < sub.grading.score) {
          map.set(sub.promptId, sub);
        }
      });
    }
    return map;
  }, [user?.essaySubmissions]);

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return ESSAY_PROMPTS.filter(p => {
      if (p.type !== activeSubTab) return false;

      // Grade filter
      if (filterGrade !== 'all' && p.grade !== filterGrade) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== 'Tất cả' && p.difficulty !== selectedDifficulty) {
        return false;
      }

      // Topic filter for social
      if (activeSubTab === 'social' && selectedTopic !== 'Tất cả' && p.topic !== selectedTopic) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchPrompt = p.prompt.toLowerCase().includes(q);
        const matchTopic = p.topic.toLowerCase().includes(q);
        const matchText = p.relatedTextTitle?.toLowerCase().includes(q) || false;
        const matchAuthor = p.relatedAuthor?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchPrompt && !matchTopic && !matchText && !matchAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [activeSubTab, filterGrade, selectedDifficulty, selectedTopic, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* ================= HERO BANNER ================= */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#EAF6FF] via-white to-[#E0F8F3] border border-[#E0EBF4] shadow-md p-6 sm:p-8 md:p-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/80 border border-[#BDE8E0] shadow-2xs text-[#00A99D] text-xs font-bold tracking-wide">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Khu vực Ôn thi Ngữ văn THCS • Chuẩn GDPT 2018</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif-academic font-bold text-[#102A43] leading-tight">
            Luyện viết Nghị luận & <span className="text-[#00A99D]">Chấm thi bằng AI</span> ✨
          </h1>

          <p className="text-sm sm:text-base text-[#61758A] leading-relaxed max-w-2xl">
            Rèn luyện tư duy nghị luận sắc bén, kỹ năng lập luận và cảm thụ văn học với hệ thống đề bám sát
            chương trình THCS. Nhận phản hồi, ma trận điểm 4 tiêu chí và đoạn văn gợi ý phát triển ý tức thì từ Giám khảo AI.
          </p>

          {/* Quick Stats Strip */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <div className="bg-white/90 px-3 py-1.5 rounded-xl border border-[#E0EBF4] shadow-2xs flex items-center space-x-1.5">
              <PenTool className="w-4 h-4 text-[#00A99D]" />
              <span className="text-[#61758A]">Tổng đề ôn luyện:</span>
              <strong className="text-[#102A43]">{ESSAY_PROMPTS.length} đề thi</strong>
            </div>

            <div className="bg-white/90 px-3 py-1.5 rounded-xl border border-[#E0EBF4] shadow-2xs flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-[#F2B544]" />
              <span className="text-[#61758A]">Bài đã hoàn thành:</span>
              <strong className="text-[#00A99D]">{user?.essaySubmissions?.length || 0} bài</strong>
            </div>

            <div className="bg-white/90 px-3 py-1.5 rounded-xl border border-[#E0EBF4] shadow-2xs flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span className="text-[#61758A]">Thưởng mỗi bài thi:</span>
              <strong className="text-[#C07D2B]">🪙 +30-50 Xu • ⚡ +80 XP</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SUB-NAVIGATION TABS ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E0EBF4] pb-2">
        <div className="flex items-center space-x-2">
          {/* Tab 1: Nghị luận xã hội */}
          <button
            onClick={(e) => {
              createRipple(e);
              setActiveSubTab('social');
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'social'
                ? 'bg-[#00A99D] text-white shadow-xs scale-102'
                : 'bg-white text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF] border border-[#E0EBF4]'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>A. Nghị luận xã hội ({ESSAY_PROMPTS.filter(p => p.type === 'social').length})</span>
          </button>

          {/* Tab 2: Nghị luận văn học */}
          <button
            onClick={(e) => {
              createRipple(e);
              setActiveSubTab('literary');
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'literary'
                ? 'bg-[#00A99D] text-white shadow-xs scale-102'
                : 'bg-white text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF] border border-[#E0EBF4]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>B. Nghị luận văn học ({ESSAY_PROMPTS.filter(p => p.type === 'literary').length})</span>
          </button>

          {/* Tab 3: Bài thi đã nộp */}
          <button
            onClick={(e) => {
              createRipple(e);
              setActiveSubTab('history');
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-[#3285E8] text-white shadow-xs scale-102'
                : 'bg-white text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF] border border-[#E0EBF4]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Bài thi đã nộp ({user?.essaySubmissions?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* ================= SEARCH & FILTERS (FOR PROMPT LISTS) ================= */}
      {activeSubTab !== 'history' && (
        <div className="bg-white rounded-2xl p-4 border border-[#E0EBF4] shadow-xs space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0B2C6]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeSubTab === 'social'
                    ? 'Tìm kiếm chủ đề: Lòng biết ơn, Trách nhiệm, Mạng xã hội, Tự học...'
                    : 'Tìm kiếm theo tác phẩm: Bầy chim chìa vôi, Lá cờ thêu sáu chữ vàng, Mùa xuân nho nhỏ...'
                }
                className="w-full pl-10 pr-4 py-2 bg-[#F4FAFF] border border-[#E0EBF4] rounded-xl text-xs sm:text-sm text-[#102A43] placeholder:text-[#A0B2C6] focus:outline-none focus:border-[#00A99D]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0B2C6] hover:text-[#102A43]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Grade */}
            <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-semibold text-[#61758A] shrink-0">Lớp:</span>
              <button
                onClick={() => setFilterGrade('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterGrade === 'all'
                    ? 'bg-[#00A99D] text-white shadow-xs'
                    : 'bg-[#F4FAFF] text-[#61758A] hover:bg-[#EAF6FF]'
                }`}
              >
                Tất cả
              </button>
              {([6, 7, 8, 9] as Grade[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setFilterGrade(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterGrade === g
                      ? 'bg-[#00A99D] text-white shadow-xs'
                      : 'bg-[#F4FAFF] text-[#61758A] hover:bg-[#EAF6FF]'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>

            {/* Filter by Difficulty */}
            <div className="flex items-center space-x-1.5 w-full md:w-auto">
              <span className="text-xs font-semibold text-[#61758A] shrink-0">Độ khó:</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="text-xs bg-[#F4FAFF] border border-[#E0EBF4] rounded-xl px-2.5 py-1.5 font-bold text-[#102A43] focus:outline-none focus:border-[#00A99D] cursor-pointer"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Cơ bản">Cơ bản</option>
                <option value="Khá">Khá</option>
                <option value="Nâng cao">Nâng cao</option>
              </select>
            </div>
          </div>

          {/* Topics Pills for Social Argumentation */}
          {activeSubTab === 'social' && (
            <div className="pt-2 border-t border-[#E0EBF4] flex items-center space-x-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-[#61758A] shrink-0 flex items-center space-x-1">
                <Filter className="w-3 h-3" />
                <span>Chủ đề:</span>
              </span>
              {socialTopics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedTopic === topic
                      ? 'bg-[#00A99D] text-white font-bold shadow-2xs'
                      : 'bg-[#F4FAFF] text-[#61758A] hover:text-[#102A43] hover:bg-[#EAF6FF] border border-[#E0EBF4]'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= PROMPT CARDS GRID (2 COLUMNS PER ROW) ================= */}
      {activeSubTab !== 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#61758A]">
            <span>Hiển thị <strong>{filteredPrompts.length}</strong> đề thi phù hợp</span>
            <span className="italic">* Không hiển thị bài mẫu trước khi nộp để bảo đảm tính khách quan</span>
          </div>

          {filteredPrompts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-[#E0EBF4]">
              <div className="w-12 h-12 rounded-full bg-[#F4FAFF] text-[#A0B2C6] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#102A43] text-base">Không tìm thấy đề thi phù hợp</h3>
              <p className="text-xs text-[#61758A]">
                Em hãy thử chọn lại bộ lọc hoặc từ khóa tìm kiếm khác nhé!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              {filteredPrompts.map((p) => {
                const pastSub = completedPromptMap.get(p.id);

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-[22px] border border-[#E0EBF4] p-5 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[#00A99D]/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#F4FAFF] border border-[#E0EBF4] text-[11px] font-mono font-bold text-[#102A43]">
                            {p.id}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-[#EAF6FF] text-[#3285E8] text-[11px] font-bold">
                            Lớp {p.grade}
                          </span>
                          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                            p.difficulty === 'Cơ bản' 
                              ? 'bg-[#E0F8F3] text-[#00A99D]' 
                              : p.difficulty === 'Khá' 
                              ? 'bg-[#FFF8E7] text-[#C07D2B]' 
                              : 'bg-[#FFF0F5] text-[#E02424]'
                          }`}>
                            {p.difficulty}
                          </span>
                        </div>

                        {/* Completion / Score status */}
                        {pastSub ? (
                          <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-[#E0F8F3] text-[#00A99D] font-bold text-xs border border-[#BDE8E0]">
                            <span>⭐ Đã đạt {pastSub.grading.score.toFixed(1)}/10</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-xs text-[#61758A]">
                            <Clock className="w-3.5 h-3.5 text-[#A0B2C6]" />
                            <span>{p.suggestedMinutes} phút</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Topic */}
                      <div>
                        <span className="text-[11px] font-semibold text-[#00A99D] uppercase tracking-wider block mb-1">
                          {p.type === 'social' ? `Chủ đề: ${p.topic}` : `Tác phẩm: ${p.relatedTextTitle || p.topic}`}
                        </span>
                        <h3 className="font-serif-academic text-base sm:text-lg font-bold text-[#102A43] group-hover:text-[#00A99D] transition-colors line-clamp-2">
                          {p.title}
                        </h3>
                      </div>

                      {/* Excerpt / Prompt preview */}
                      <p className="text-xs sm:text-sm text-[#61758A] line-clamp-3 leading-relaxed font-serif-academic">
                        {p.prompt}
                      </p>

                      {/* Key requirements preview */}
                      <div className="bg-[#F8FAFC] rounded-xl p-2.5 border border-[#E0EBF4] text-[11px] text-[#334E68] space-y-1">
                        <span className="font-bold text-[#102A43] block">Yêu cầu trọng tâm:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[#61758A]">
                          {p.requirements.slice(0, 2).map((req, rIdx) => (
                            <li key={rIdx} className="truncate">{req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-2 border-t border-[#E0EBF4] flex items-center justify-between">
                      <div className="text-xs text-[#61758A] flex items-center space-x-1">
                        <Award className="w-3.5 h-3.5 text-[#F2B544]" />
                        <span>Thang điểm: <strong>10.0đ</strong></span>
                      </div>

                      <button
                        onClick={(e) => {
                          createRipple(e);
                          onStartExam(p);
                        }}
                        className="btn-primary-teal px-4 py-2 text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-2xs group-hover:shadow-md transition-all cursor-pointer"
                      >
                        <span>{pastSub ? 'Luyện tập lại' : 'Vào phòng thi'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SUBMISSIONS HISTORY TAB ================= */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#61758A]">
            <span>Lịch sử bài thi đã chấm của học sinh ({user?.essaySubmissions?.length || 0} bài)</span>
            <span className="text-[#00A99D] font-bold">Dữ liệu được lưu trữ tự động trong tài khoản</span>
          </div>

          {!user?.essaySubmissions || user.essaySubmissions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-[#E0EBF4]">
              <div className="w-14 h-14 rounded-full bg-[#EAF6FF] text-[#3285E8] flex items-center justify-center mx-auto">
                <PenTool className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-[#102A43] text-lg">Chưa có bài thi nào được nộp</h3>
              <p className="text-xs text-[#61758A] max-w-sm mx-auto">
                Em hãy chọn một đề bài trong mục "Nghị luận xã hội" hoặc "Nghị luận văn học" để bắt đầu rèn luyện và nhận điểm số đánh giá từ Giám khảo AI nhé!
              </p>
              <button
                onClick={() => setActiveSubTab('social')}
                className="btn-primary-teal px-5 py-2.5 text-xs sm:text-sm font-bold cursor-pointer"
              >
                Khám phá đề thi ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {user.essaySubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl p-5 border border-[#E0EBF4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                        sub.type === 'social' ? 'bg-[#EAF6FF] text-[#3285E8]' : 'bg-[#E0F8F3] text-[#00A99D]'
                      }`}>
                        {sub.type === 'social' ? 'Nghị luận xã hội' : 'Nghị luận văn học'}
                      </span>
                      <span className="text-[11px] text-[#A0B2C6]">
                        {new Date(sub.submittedAt).toLocaleDateString('vi-VN')} {new Date(sub.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="font-serif-academic font-bold text-base text-[#102A43] line-clamp-1">
                      {sub.promptTitle}
                    </h4>

                    {/* Teacher praise */}
                    <p className="text-xs italic text-[#00A99D] font-medium line-clamp-2 bg-[#E0F8F3]/50 p-2.5 rounded-xl border border-[#BDE8E0]/40">
                      "{sub.grading.teacherPraise}"
                    </p>

                    <div className="flex items-center space-x-3 text-xs text-[#61758A] pt-1">
                      <span>Số từ: <strong>{sub.wordCount}</strong></span>
                      <span>•</span>
                      <span>Thời gian: <strong>{Math.round(sub.timeSpentSeconds / 60)} phút</strong></span>
                      <span>•</span>
                      <span className="text-[#C07D2B] font-bold">🪙 +{sub.coinsAwarded} Xu</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E0EBF4] flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-extrabold text-[#00A99D]">
                        {sub.grading.score.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#61758A]">/ 10đ</span>
                    </div>

                    <button
                      onClick={() => setViewingSubmission(sub)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#EAF6FF] hover:bg-[#D9EFFF] text-[#3285E8] text-xs font-bold transition-all cursor-pointer"
                    >
                      Xem chi tiết nhận xét
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= SUBMISSION DETAIL MODAL ================= */}
      {viewingSubmission && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E0EBF4]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E0EBF4] pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#E0F8F3] text-[#00A99D]">
                  {viewingSubmission.type === 'social' ? 'Nghị luận xã hội' : 'Nghị luận văn học'} • Mã đề: {viewingSubmission.promptId}
                </span>
                <h3 className="font-serif-academic font-bold text-lg text-[#102A43] mt-1">
                  {viewingSubmission.promptTitle}
                </h3>
              </div>
              <button
                onClick={() => setViewingSubmission(null)}
                className="p-1.5 rounded-xl text-[#61758A] hover:bg-[#F4FAFF] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score Banner */}
            <div className="bg-gradient-to-r from-[#00A99D] to-[#008F85] rounded-2xl p-5 text-white flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold text-white/80">Điểm tổng kết</p>
                <p className="font-serif-academic text-base sm:text-lg font-bold">
                  {viewingSubmission.grading.teacherPraise}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-extrabold">{viewingSubmission.grading.score.toFixed(1)}</span>
                <span className="text-sm text-white/80"> / 10</span>
              </div>
            </div>

            {/* Criteria breakdown */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                Điểm số chi tiết 4 tiêu chí
              </h4>
              <div className="space-y-2">
                {viewingSubmission.grading.criteriaScores.map((c, i) => (
                  <div key={i} className="bg-[#F8FAFC] p-3 rounded-xl border border-[#E0EBF4] text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#102A43]">
                      <span>{c.criteria}</span>
                      <span className="text-[#00A99D]">{c.score} / {c.maxPoints}đ</span>
                    </div>
                    <p className="text-[#61758A] leading-relaxed">{c.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#E0F8F3] p-3.5 rounded-xl border border-[#BDE8E0] space-y-1">
                <p className="font-bold text-[#00A99D]">Ưu điểm bài viết:</p>
                <ul className="list-disc list-inside space-y-1 text-[#102A43]">
                  {viewingSubmission.grading.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#FFF8E7] p-3.5 rounded-xl border border-[#FCE1A8] space-y-1">
                <p className="font-bold text-[#C07D2B]">Điểm cần khắc phục:</p>
                <ul className="list-disc list-inside space-y-1 text-[#102A43]">
                  {viewingSubmission.grading.weaknesses.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Student's Full Essay */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                Bài làm của học sinh ({viewingSubmission.wordCount} từ)
              </h4>
              <div className="bg-[#F4FAFF] p-4 rounded-2xl border border-[#E0EBF4] font-serif-academic text-sm text-[#102A43] leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto">
                {viewingSubmission.content}
              </div>
            </div>

            {/* Close Button */}
            <div className="text-right pt-2 border-t border-[#E0EBF4]">
              <button
                onClick={() => setViewingSubmission(null)}
                className="btn-primary-teal px-5 py-2 text-xs font-bold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
