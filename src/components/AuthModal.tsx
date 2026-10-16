import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grade } from '../types';
import { AVATAR_OPTIONS } from '../data/badges';
import { X, Mail, Lock, User as UserIcon, GraduationCap, Sparkles, CheckCircle2, ShieldCheck, PlayCircle, Info } from 'lucide-react';
import { createRipple } from '../utils/interactiveEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'guest';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login'
}) => {
  const { login, register, loginAsGuest } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'guest'>(defaultTab);

  // Form states
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<Grade>(7);
  const [avatar, setAvatar] = useState('🐱');
  const [guestName, setGuestName] = useState('Bạn nhỏ ham đọc');
  const [guestGrade, setGuestGrade] = useState<Grade>(7);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier) {
      setError('Vui lòng nhập Email hoặc Tên đăng nhập');
      return;
    }
    setLoading(true);
    try {
      const ok = await login(identifier, password);
      if (ok) {
        onClose();
      } else {
        setError('Mật khẩu không chính xác hoặc tài khoản không tồn tại.');
      }
    } catch {
      setError('Đã xảy ra lỗi khi đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !identifier.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ họ tên, tài khoản và mật khẩu.');
      return;
    }
    if (password.length < 4) {
      setError('Mật khẩu cần có ít nhất 4 ký tự để bảo đảm an toàn.');
      return;
    }
    setLoading(true);
    try {
      const ok = await register(name, identifier, password, grade, avatar);
      if (ok) {
        onClose();
      }
    } catch {
      setError('Không thể tạo tài khoản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestTrial = () => {
    loginAsGuest(guestGrade, guestName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-[#E5DED3] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Academic Header */}
        <div className="relative bg-[#252420] text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#FAF7F2]/10 border border-white/10">
              <Sparkles className="w-5 h-5 text-[#B88945]" />
            </div>
            <div>
              <h2 className="text-lg font-serif-academic font-bold tracking-tight">Học tập cùng ReadMind AI</h2>
              <p className="text-xs text-[#A8A29A]">Khám phá thế giới đọc hiểu Ngữ văn THCS</p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex bg-[#12110F] p-1 rounded-xl mt-5 text-xs font-semibold border border-white/10">
            <button
              type="button"
              onClick={(e) => { createRipple(e); setTab('login'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ripple-container ${
                tab === 'login' ? 'bg-[#FAF7F2] text-[#252420] shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={(e) => { createRipple(e); setTab('register'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ripple-container ${
                tab === 'register' ? 'bg-[#FAF7F2] text-[#252420] shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              Đăng ký
            </button>
            <button
              type="button"
              onClick={(e) => { createRipple(e); setTab('guest'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg transition-all ripple-container ${
                tab === 'guest' ? 'bg-[#B88945] text-white shadow-xs' : 'text-white/70 hover:text-white'
              }`}
            >
              Dùng thử ngay
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center space-x-2">
              <Info className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Email hoặc Tên đăng nhập
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#77736D]" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ví dụ: linh.kieu@truongthcs.edu.vn hoặc kieulinh"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#77736D]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu của em"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={createRipple}
                className="btn-academic-primary ripple-container w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Đang đăng nhập...' : 'Vào học ngay'}</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#E5DED3]"></div>
                <span className="flex-shrink mx-3 text-[#77736D] text-xs">hoặc</span>
                <div className="flex-grow border-t border-[#E5DED3]"></div>
              </div>

              <button
                type="button"
                onClick={(e) => { createRipple(e); setTab('guest'); }}
                className="btn-academic-secondary ripple-container w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center space-x-2"
              >
                <PlayCircle className="w-4 h-4 text-[#B88945]" />
                <span>Trải nghiệm trực tiếp không cần tài khoản</span>
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Họ và tên học sinh
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 text-[#77736D]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Email hoặc Tên đăng nhập
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-[#77736D]" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="an.nguyen hoặc an@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#77736D]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 4 ký tự"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945]"
                    required
                  />
                </div>
              </div>

              {/* Grade Selection */}
              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1 flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#B88945]" />
                  <span>Em đang học lớp mấy?</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([6, 7, 8, 9] as Grade[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={(e) => { createRipple(e); setGrade(g); }}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ripple-container ${
                        grade === g
                          ? 'bg-[#252420] text-white border-[#252420] shadow-xs'
                          : 'bg-[#F0ECE5] text-[#59554F] border-[#E5DED3] hover:bg-[#E5DED3]'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Chọn bạn đồng hành:
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={(e) => { createRipple(e); setAvatar(item.emoji); }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform ripple-container ${
                        avatar === item.emoji
                          ? 'ring-2 ring-[#B88945] scale-105 bg-[#FAF7F2] border border-[#B88945]'
                          : 'bg-[#F7F5F0] border border-[#E5DED3] hover:border-[#B88945]/40'
                      }`}
                      title={item.label}
                    >
                      {item.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={createRipple}
                className="btn-academic-primary ripple-container w-full py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 mt-2"
              >
                <span>{loading ? 'Đang tạo...' : 'Đăng ký & Bắt đầu học'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: GUEST TRIAL */}
          {tab === 'guest' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#B88945]/30 text-[#252420] space-y-2">
                <div className="flex items-center space-x-2 text-[#8B6426] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#B88945]" />
                  <span>Chế độ Trải nghiệm Nhanh</span>
                </div>
                <p className="text-xs text-[#59554F] leading-relaxed">
                  Em có thể sử dụng ngay toàn bộ các tính năng: luyện đọc thành tiếng, làm bài tập câu hỏi thông minh, chơi trò chơi và nhận gợi ý từ Trợ lý AI mà không cần phải đăng ký email hay mật khẩu.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Tên của em (hiển thị khi học):
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="ví dụ: Tuấn Minh, Mai Anh..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#E5DED3] bg-[#FAF7F2] text-[#252420] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#252420] mb-1">
                  Chọn khối lớp em muốn luyện đọc:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([6, 7, 8, 9] as Grade[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={(e) => { createRipple(e); setGuestGrade(g); }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ripple-container ${
                        guestGrade === g
                          ? 'bg-[#252420] text-white border-[#252420] shadow-xs'
                          : 'bg-white text-[#59554F] border-[#E5DED3] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  createRipple(e);
                  handleGuestTrial();
                }}
                className="btn-academic-primary ripple-container w-full py-3 text-xs sm:text-sm font-bold flex items-center justify-center space-x-2"
              >
                <PlayCircle className="w-4 h-4 text-[#B88945]" />
                <span>Bắt đầu luyện đọc ngay</span>
              </button>
            </div>
          )}

          {/* Firebase Guide Accordion */}
          <div className="pt-2 border-t border-[#E5DED3]">
            <button
              onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
              className="text-[11px] text-[#8B6426] hover:text-[#B88945] flex items-center space-x-1 font-semibold"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{showFirebaseGuide ? 'Ẩn hướng dẫn tài khoản' : 'Bảo mật và lưu trữ tài khoản'}</span>
            </button>

            {showFirebaseGuide && (
              <div className="mt-2 p-3 bg-[#FAF7F2] rounded-xl text-[11px] text-[#59554F] border border-[#E5DED3] space-y-1.5 animate-fade-in-up">
                <p className="font-semibold text-[#252420]">Bảo mật và đồng bộ dữ liệu học tập:</p>
                <p>
                  Hệ thống hiện đang lưu trữ an toàn trong LocalStorage trình duyệt có băm mật khẩu bảo vệ quyền riêng tư học sinh.
                </p>
                <p>
                  Dữ liệu tiến độ, số xu và huy hiệu của em được bảo toàn vẹn nguyên trên máy tính và điện thoại.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
