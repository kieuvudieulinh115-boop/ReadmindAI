import React, { useState } from 'react';
import { TextItem, Grade, Genre, Difficulty } from '../types';
import { X, Plus, Trash2, Edit3, BookOpen, Save, CheckCircle2 } from 'lucide-react';
import { createRipple } from '../utils/interactiveEffects';

interface AdminManageTextsModalProps {
  isOpen: boolean;
  onClose: () => void;
  texts: TextItem[];
  onAddText: (newText: TextItem) => void;
  onDeleteText: (id: string) => void;
}

export const AdminManageTextsModal: React.FC<AdminManageTextsModalProps> = ({
  isOpen,
  onClose,
  texts,
  onAddText,
  onDeleteText
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  // New text form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [grade, setGrade] = useState<Grade>(7);
  const [genre, setGenre] = useState<Genre>('truyen');
  const [unit, setUnit] = useState('Bài bổ trợ: Mở rộng đọc hiểu');
  const [difficulty, setDifficulty] = useState<Difficulty>('trung-binh');
  const [minutes, setMinutes] = useState(4);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPoem, setIsPoem] = useState(false);
  const [wordListStr, setWordListStr] = useState('Nhân hậu: Hiền từ và giàu lòng thương người\nTự lập: Tự làm lấy mọi việc của mình');
  const [successNotice, setSuccessNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // Parse vocabulary string format "word: meaning"
    const parsedVocab = wordListStr
      .split('\n')
      .map(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { word: parts[0].trim(), meaning: parts.slice(1).join(':').trim() };
        }
        return null;
      })
      .filter(Boolean) as any[];

    const newId = 'custom-' + Date.now();
    const newText: TextItem = {
      id: newId,
      title: title.trim(),
      authorOrSource: author.trim() || 'Tài liệu bổ trợ GDPT 2018',
      grade,
      bookCollection: 'Kết nối tri thức với cuộc sống (Bổ sung)',
      unit: unit.trim() || 'Bài bổ trợ',
      genre,
      difficulty,
      estimatedReadMinutes: Number(minutes) || 4,
      excerpt: excerpt.trim() || content.slice(0, 150) + '...',
      content: content.trim(),
      isPoem,
      vocabularyList: parsedVocab.length > 0 ? parsedVocab : [
        { word: 'Cốt lõi', meaning: 'Phần quan trọng, căn bản nhất của sự vật hoặc ý niệm.' }
      ],
      questions: [
        {
          id: 'q_' + newId + '_1',
          type: 'multiple-choice',
          level: 'nhan-biet',
          prompt: `Nội dung chính được thể hiện trong tác phẩm "${title}" là gì?`,
          options: [
            'Bàn về bài học nhân văn và ý nghĩa cuộc sống',
            'Miêu tả một cuộc tranh luận vô thưởng vô phạt',
            'Kể về chuyến du lịch giải trí',
            'Thống kê các con số toán học'
          ],
          correctAnswer: 'Bàn về bài học nhân văn và ý nghĩa cuộc sống',
          explanation: 'Tác phẩm tập trung thể hiện cái đẹp của tâm hồn và bài học nhân sinh.',
          hint: 'Đọc kỹ toàn bộ văn bản để nắm chủ đề chính.'
        },
        {
          id: 'q_' + newId + '_2',
          type: 'true-false',
          level: 'thong-hieu',
          prompt: 'Tác phẩm này phù hợp với định hướng rèn luyện năng lực đọc hiểu của Chương trình GDPT 2018. (Đúng hay Sai?)',
          options: ['Đúng', 'Sai'],
          correctAnswer: 'Đúng',
          explanation: 'Văn bản giúp học sinh phát triển năng lực ngôn ngữ và cảm thụ thẩm mỹ.',
          hint: 'Liên hệ với yêu cầu cần đạt của môn Ngữ văn.'
        },
        {
          id: 'q_' + newId + '_3',
          type: 'short-essay',
          level: 'van-dung',
          prompt: 'Sau khi đọc văn bản này, em tâm đắc nhất điều gì và sẽ vận dụng vào cuộc sống của mình ra sao?',
          explanation: 'Đánh giá khả năng liên hệ bản thân và rút ra bài học thực tiễn.',
          hint: 'Nêu suy nghĩ chân thành và 1 hành động cụ thể em sẽ làm.'
        }
      ]
    };

    onAddText(newText);
    setSuccessNotice(true);
    setTimeout(() => {
      setSuccessNotice(false);
      setActiveTab('list');
    }, 1500);

    // Reset form
    setTitle('');
    setAuthor('');
    setContent('');
    setExcerpt('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-[#E5DED3] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#252420] p-5 text-white flex items-center justify-between border-b border-[#3A3833]">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-[#B88945]" />
            <div>
              <h2 className="text-base sm:text-lg font-serif-academic font-bold">Giao diện Giáo viên: Quản trị kho văn bản</h2>
              <p className="text-xs text-[#A6A29A]">Bổ sung, chỉnh sửa và phân loại bài đọc theo Chương trình GDPT 2018</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5DED3] px-6 pt-3 space-x-4 text-xs font-semibold bg-[#FAF7F2]">
          <button
            onClick={(e) => {
              createRipple(e);
              setActiveTab('list');
            }}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'list'
                ? 'border-[#B88945] text-[#252420] font-bold'
                : 'border-transparent text-[#77736D] hover:text-[#252420]'
            }`}
          >
            Danh sách bài đọc hiện có ({texts.length})
          </button>
          <button
            onClick={(e) => {
              createRipple(e);
              setActiveTab('add');
            }}
            className={`pb-2.5 border-b-2 transition-colors flex items-center space-x-1 cursor-pointer ${
              activeTab === 'add'
                ? 'border-[#B88945] text-[#252420] font-bold'
                : 'border-transparent text-[#77736D] hover:text-[#252420]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm bài đọc mới</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'list' ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Thầy cô có thể kiểm tra danh sách văn bản hoặc xóa bài đọc đã biên soạn.
              </p>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {texts.map((t) => (
                  <div key={t.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Lớp {t.grade}
                        </span>
                        <span className="text-sm font-bold text-slate-800">{t.title}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {t.authorOrSource} &bull; {t.unit} &bull; Thể loại: {t.genre}
                      </p>
                    </div>

                    <button
                      onClick={() => onDeleteText(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Xóa bài đọc này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {successNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã thêm bài đọc mới thành công vào kho ngữ liệu!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#59554F] mb-1">Tên văn bản / Tác phẩm *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ví dụ: Đồng chí, Đoàn thuyền đánh cá..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#59554F] mb-1">Tác giả hoặc Nguồn trích dẫn *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Chính Hữu, Huy Cận, Báo Tuổi Trẻ..."
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#59554F] mb-1">Khối lớp *</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(Number(e.target.value) as Grade)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] font-semibold focus:outline-none focus:border-[#B88945]"
                  >
                    <option value={6}>Ngữ văn Lớp 6</option>
                    <option value={7}>Ngữ văn Lớp 7</option>
                    <option value={8}>Ngữ văn Lớp 8</option>
                    <option value={9}>Ngữ văn Lớp 9</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#59554F] mb-1">Thể loại văn bản *</label>
                  <select
                    value={genre}
                    onChange={(e) => {
                      setGenre(e.target.value as Genre);
                      if (e.target.value === 'tho') setIsPoem(true);
                      else setIsPoem(false);
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] font-semibold focus:outline-none focus:border-[#B88945]"
                  >
                    <option value="truyen">Truyện</option>
                    <option value="tho">Thơ</option>
                    <option value="nghi-luan">Văn bản nghị luận</option>
                    <option value="thong-tin">Văn bản thông tin</option>
                    <option value="ngu-ngon">Truyện ngụ ngôn</option>
                    <option value="khoa-hoc">Truyện khoa học</option>
                    <option value="doi-song-moi-truong">Đời sống & Môi trường</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#59554F] mb-1">Chủ điểm bài học (Unit)</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="ví dụ: Bài 1: Tôi và các bạn, Bài 2: Khúc nhạc tâm hồn..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#59554F] mb-1">Tóm tắt ngắn (Excerpt)</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="1-2 câu tóm tắt nội dung chính gợi mở..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#59554F] mb-1">Nội dung văn bản đầy đủ *</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập toàn văn bài đọc hoặc các khổ thơ..."
                  className="w-full p-3 text-xs sm:text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] font-serif-literary leading-relaxed focus:outline-none focus:border-[#B88945]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#59554F] mb-1">
                  Từ ngữ cần giải thích (mỗi dòng: Từ: Giải nghĩa)
                </label>
                <textarea
                  rows={3}
                  value={wordListStr}
                  onChange={(e) => setWordListStr(e.target.value)}
                  placeholder="Từ: Ý nghĩa giải thích..."
                  className="w-full p-2.5 text-xs rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="btn-academic-primary ripple-container inline-flex items-center space-x-2 text-white px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#B88945]" />
                  <span>Lưu & Xuất bản bài đọc</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
