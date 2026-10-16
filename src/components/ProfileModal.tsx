import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grade } from '../types';
import { AVATAR_OPTIONS, INITIAL_BADGES } from '../data/badges';
import { REWARD_ITEMS } from '../data/rewards';
import { 
  X, 
  Award, 
  Flame, 
  BookOpen, 
  Clock, 
  GraduationCap, 
  User as UserIcon, 
  LogOut, 
  Check, 
  Sparkles,
  History,
  PenTool,
  Package,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { AvatarWithFrame } from './AvatarWithFrame';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthForUpgrade: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthForUpgrade
}) => {
  const { user, updateProfile, logout, equipItem, unequipItem } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [grade, setGrade] = useState<Grade>(user?.grade || 7);
  const [avatar, setAvatar] = useState(user?.avatar || '🐱');
  const [isSaved, setIsSaved] = useState(false);
  const [inventoryTab, setInventoryTab] = useState<'all' | 'frame' | 'title' | 'other'>('all');

  if (!isOpen || !user) return null;

  const unlocked = user.unlockedItems || [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, grade, avatar });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const filteredInventory = REWARD_ITEMS.filter((item) => {
    if (inventoryTab === 'frame') return item.type === 'frame';
    if (inventoryTab === 'title') return item.type === 'title';
    if (inventoryTab === 'other') return item.type !== 'frame' && item.type !== 'title';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-[#252420] p-6 text-white flex items-center justify-between border-b border-[#E5DED3]">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <AvatarWithFrame 
                avatar={avatar} 
                frameId={user.equippedFrameId} 
                size="lg" 
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-serif-academic font-bold">{user.name}</h2>
                {user.isGuest && (
                  <span className="text-[10px] bg-[#B88945] text-white font-bold px-2 py-0.5 rounded-full">
                    Dùng thử
                  </span>
                )}
                {user.equippedTitleId && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold px-2 py-0.5 rounded-full">
                    {REWARD_ITEMS.find(r => r.id === user.equippedTitleId)?.title.replace('Danh hiệu: ', '') || 'Trạng Nguyên'}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A8A29A] mt-0.5">
                Học sinh Lớp {user.grade} &bull; Tham gia từ {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DED3]">
              <Award className="w-5 h-5 text-[#B88945] mx-auto" />
              <p className="text-lg sm:text-xl font-black text-[#252420] mt-1">{user.xp}</p>
              <p className="text-[10px] text-[#77736D] font-bold uppercase tracking-wider">Kinh nghiệm XP</p>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DED3]">
              <span className="text-xl block">🪙</span>
              <p className="text-lg sm:text-xl font-black text-[#C07D2B] mt-0.5">{user.coins || 80}</p>
              <p className="text-[10px] text-[#77736D] font-bold uppercase tracking-wider">Ví Xu</p>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DED3]">
              <BookOpen className="w-5 h-5 text-[#8B6426] mx-auto" />
              <p className="text-lg sm:text-xl font-black text-[#252420] mt-1">{user.completedTextIds.length}</p>
              <p className="text-[10px] text-[#77736D] font-bold uppercase tracking-wider">Bài đọc hiểu</p>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E5DED3]">
              <PenTool className="w-5 h-5 text-[#00A99D] mx-auto" />
              <p className="text-lg sm:text-xl font-black text-[#00A99D] mt-1">{user.essaySubmissions?.length || 0}</p>
              <p className="text-[10px] text-[#77736D] font-bold uppercase tracking-wider">Bài thi văn</p>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSave} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E5DED3] space-y-4">
            <h3 className="text-xs font-serif-academic font-bold uppercase tracking-wider text-[#252420]">
              Thông tin học tập cá nhân
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#59554F] mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-[#E5DED3] focus:outline-none focus:border-[#B88945] text-[#252420]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#59554F] mb-1">Khối lớp hiện tại</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value) as Grade)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-[#E5DED3] focus:outline-none focus:border-[#B88945] font-semibold text-[#252420]"
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                </select>
              </div>
            </div>

            {/* Avatar picker */}
            <div>
              <label className="block text-xs font-semibold text-[#59554F] mb-1.5">Chọn Avatar</label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAvatar(item.emoji)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer ${
                      avatar === item.emoji
                        ? 'ring-2 ring-[#B88945] scale-110 bg-[#FAF7F2] shadow-xs'
                        : 'bg-white border border-[#E5DED3] hover:bg-[#FAF7F2]'
                    }`}
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#8B6426] font-bold">
                {isSaved ? 'Đã lưu thay đổi thành công!' : ''}
              </span>
              <button
                type="submit"
                className="btn-academic-primary ripple-container text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Cập nhật hồ sơ
              </button>
            </div>
          </form>

          {/* ===================== KHO QUÀ CỦA TÔI (MY INVENTORY) ===================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-serif-academic font-bold uppercase tracking-wider text-[#252420] flex items-center space-x-1.5">
                <Package className="w-4 h-4 text-[#00A99D]" />
                <span>Kho quà của tôi ({unlocked.length} vật phẩm đã mở khóa)</span>
              </h3>
            </div>

            {/* Filter buttons */}
            <div className="flex space-x-1.5 overflow-x-auto text-xs pb-1">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'frame', label: 'Khung Avatar' },
                { id: 'title', label: 'Danh hiệu' },
                { id: 'other', label: 'Bảo bối & Khác' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setInventoryTab(t.id as any)}
                  className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
                    inventoryTab === t.id
                      ? 'bg-[#00A99D] text-white'
                      : 'bg-[#FAF7F2] text-[#77736D] hover:text-[#252420] border border-[#E5DED3]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredInventory.map((item) => {
                const isOwned = unlocked.includes(item.id);
                const isEquipped = (item.type === 'frame' && user.equippedFrameId === item.id) ||
                                  (item.type === 'title' && user.equippedTitleId === item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isEquipped
                        ? 'bg-[#E0F8F3] border-[#00A99D] ring-2 ring-[#00A99D]/20 shadow-xs'
                        : isOwned
                        ? 'bg-white border-[#B88945]/40 shadow-2xs'
                        : 'bg-[#FAF7F2]/50 border-[#E5DED3] opacity-55'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.type === 'frame' ? (
                        <div className="shrink-0">
                          <AvatarWithFrame avatar={user.avatar || '🦉'} frameId={item.id} size="sm" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5DED3] flex items-center justify-center text-xl shrink-0">
                          {item.icon}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#252420] leading-snug">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#77736D]">
                          {item.type === 'frame' ? '✨ Khung Avatar' : item.type === 'title' ? '👑 Danh hiệu' : '🚀 Bảo bối'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {isEquipped ? (
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-bold text-[#00A99D] bg-white px-2 py-0.5 rounded-md border border-[#00A99D]">
                            Đang sử dụng
                          </span>
                          <div>
                            <button
                              onClick={() => unequipItem(item.type as 'frame' | 'title')}
                              className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                            >
                              Gỡ bỏ
                            </button>
                          </div>
                        </div>
                      ) : isOwned ? (
                        <div className="space-y-1">
                          <span className="inline-block text-[10px] font-bold text-[#8B6426] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-[#B88945]/30">
                            Đã sở hữu
                          </span>
                          {(item.type === 'frame' || item.type === 'title') && (
                            <div>
                              <button
                                onClick={() => equipItem(item.id, item.type as 'frame' | 'title')}
                                className="btn-primary-teal text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                              >
                                Sử dụng
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-semibold text-[#A6A29A] block">
                            Chưa sở hữu
                          </span>
                          <span className="text-[10px] font-bold text-[#8B6426] block">
                            {item.cost} Xu
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-serif-academic font-bold uppercase tracking-wider text-[#252420] flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-[#B88945]" />
              <span>Huy hiệu thành tích ({user.badges.length}/{INITIAL_BADGES.length})</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INITIAL_BADGES.map((b) => {
                const isUnlocked = user.badges.some(ub => ub.id === b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isUnlocked
                        ? 'bg-[#FAF7F2] border-[#B88945]/40 text-[#252420] shadow-2xs'
                        : 'bg-[#FAF7F2]/30 border-[#E5DED3] text-[#A6A29A] opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <p className="text-xs font-bold mt-1 leading-snug">{b.title}</p>
                    <p className="text-[10px] text-[#77736D] mt-0.5 line-clamp-2">{b.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reading History */}
          {user.history.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-serif-academic font-bold uppercase tracking-wider text-[#252420] flex items-center space-x-1.5">
                <History className="w-4 h-4 text-[#B88945]" />
                <span>Lịch sử luyện đọc gần đây</span>
              </h3>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {user.history.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-[#E5DED3] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#252420]">{item.textTitle}</p>
                      <p className="text-[10px] text-[#77736D]">
                        {new Date(item.completedAt).toLocaleDateString('vi-VN')} &bull; Độ chuẩn giọng: {item.accuracy}% ({item.wpm} WPM)
                      </p>
                    </div>
                    {item.quizScore !== undefined && (
                      <span className="font-bold text-[#8B6426] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#B88945]/30">
                        {item.quizScore}đ
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Essay Submissions History */}
          {user.essaySubmissions && user.essaySubmissions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-serif-academic font-bold uppercase tracking-wider text-[#252420] flex items-center space-x-1.5">
                <PenTool className="w-4 h-4 text-[#00A99D]" />
                <span>Bài thi văn nghị luận đã nộp ({user.essaySubmissions.length})</span>
              </h3>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {user.essaySubmissions.slice(0, 5).map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-white rounded-xl border border-[#E5DED3] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#252420] line-clamp-1">{sub.promptTitle}</p>
                      <p className="text-[10px] text-[#77736D]">
                        {new Date(sub.submittedAt).toLocaleDateString('vi-VN')} &bull; {sub.wordCount} từ &bull; {sub.type === 'social' ? 'Nghị luận xã hội' : 'Nghị luận văn học'}
                      </p>
                    </div>
                    <span className="font-bold text-[#00A99D] bg-[#E0F8F3] px-2.5 py-0.5 rounded-lg border border-[#BDE8E0]">
                      {sub.grading.score.toFixed(1)}/10đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guest account upgrade alert */}
          {user.isGuest && (
            <div className="p-4 bg-[#FAF7F2] border border-[#B88945]/40 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <p className="font-bold text-[#252420]">Em đang sử dụng tài khoản dùng thử</p>
                <p className="text-[#77736D]">Đăng ký tài khoản chính thức để đồng bộ lịch sử trên mọi thiết bị.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthForUpgrade();
                }}
                className="btn-academic-primary text-white font-semibold px-3 py-1.5 rounded-xl shrink-0 cursor-pointer"
              >
                Đăng ký ngay
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5DED3] flex items-center justify-between bg-[#FAF7F2]">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất tài khoản</span>
          </button>

          <button
            onClick={onClose}
            className="btn-academic-secondary px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
