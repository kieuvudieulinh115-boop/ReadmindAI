import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Grade } from '../types';
import { AVATAR_OPTIONS } from '../data/badges';
import { 
  Sparkles, 
  ArrowRight, 
  Music, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { chillAudio } from '../utils/chillAudio';
import { use3DTilt, createRipple } from '../utils/interactiveEffects';

interface StudentWelcomeGateProps {
  onEnter: (grade: Grade) => void;
  onOpenDetailedAuth: () => void;
}

export const StudentWelcomeGate: React.FC<StudentWelcomeGateProps> = ({
  onEnter,
  onOpenDetailedAuth
}) => {
  const { loginAsGuest, login, register } = useAuth();
  
  // Active mode inside right card: 'fast-start' | 'login' | 'register'
  const [activeCardTab, setActiveCardTab] = useState<'fast-start' | 'login'>('fast-start');
  
  // Fast start state
  const [selectedGrade, setSelectedGrade] = useState<Grade>(7);
  const [studentName, setStudentName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🐱');
  const [enableChillMusic, setEnableChillMusic] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3D Tilt hook for the main interactive right card
  const rightCardRef = use3DTilt<HTMLDivElement>(3.5);
  const leftFeatureCardRef = use3DTilt<HTMLDivElement>(3);

  const gradeList: { grade: Grade; label: string; sub: string; epTitle: string }[] = [
    { grade: 6, label: 'Ngữ văn 6', sub: 'Lớp sáu', epTitle: 'Tôi và các bạn, Gõ cửa trái tim, Yêu thương...' },
    { grade: 7, label: 'Ngữ văn 7', sub: 'Lớp bảy', epTitle: 'Bầu trời tuổi thơ, Khúc nhạc tâm hồn, Cội nguồn...' },
    { grade: 8, label: 'Ngữ văn 8', sub: 'Lớp tám', epTitle: 'Câu chuyện lịch sử, Vẻ đẹp cổ điển, Lời sông núi...' },
    { grade: 9, label: 'Ngữ văn 9', sub: 'Lớp chín', epTitle: 'Thế giới kì ảo, Cung bậc tâm trạng, Khát vọng...' },
  ];

  const handleStartFast = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = studentName.trim() || `Học sinh Lớp ${selectedGrade}`;
    loginAsGuest(selectedGrade, finalName);

    if (enableChillMusic && !chillAudio.getIsPlaying()) {
      chillAudio.start('lofi');
    }

    onEnter(selectedGrade);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);
    try {
      const ok = await login(loginEmail, loginPassword);
      if (ok) {
        if (enableChillMusic && !chillAudio.getIsPlaying()) {
          chillAudio.start('lofi');
        }
        onEnter(selectedGrade);
      } else {
        setLoginError('Tài khoản hoặc mật khẩu không chính xác. Em có thể chọn Đăng nhập nhanh bên dưới.');
      }
    } catch {
      setLoginError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoStudent = () => {
    loginAsGuest(7, 'Minh Anh (Học sinh lớp 7)');
    if (enableChillMusic && !chillAudio.getIsPlaying()) {
      chillAudio.start('lofi');
    }
    onEnter(7);
  };

  const handleQuickDemoTeacher = () => {
    loginAsGuest(8, 'Cô Phương Thảo (Giáo viên)');
    if (enableChillMusic && !chillAudio.getIsPlaying()) {
      chillAudio.start('lofi');
    }
    onEnter(8);
  };

  return (
    <div className="min-h-screen bg-[#F4FAFF] text-[#102A43] flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans selection:bg-[#00A99D]/20 selection:text-[#102A43]">
      {/* Container 1280px 2-column layout matching Reference Image 2 */}
      <div className="w-full max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* ========================================================================= */}
        {/* CỘT TRÁI (55% - 60% chiều rộng trên desktop) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-7 animate-fade-in-up">
          
          {/* Tag nhỏ học thuật */}
          <div className="inline-flex items-center space-x-2 bg-white border border-[#00A99D]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#007F76] tracking-wide shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00A99D]" />
            <span>NGỮ VĂN THCS &bull; CHƯƠNG TRÌNH GDPT 2018</span>
          </div>

          {/* Tiêu đề & phụ đề */}
          <div className="space-y-3">
            <h1 className="text-sm uppercase tracking-widest font-bold text-[#00A99D]">
              Nền tảng đọc hiểu thông minh ReadMind AI
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#102A43] leading-[1.2] tracking-tight">
              Nuôi dưỡng năng lực đọc sâu và tư duy phản biện
            </h2>
          </div>

          {/* Đoạn giới thiệu */}
          <p className="text-[#61758A] text-base sm:text-[16.5px] leading-relaxed">
            ReadMind AI là nền tảng hỗ trợ học sinh THCS rèn luyện kỹ năng đọc hiểu thông qua các văn bản Ngữ văn chuẩn mực, tích hợp bài đọc và câu hỏi 3 mức độ, luyện giọng biểu cảm cùng công nghệ trí tuệ nhân tạo.
          </p>

          {/* Câu trích dẫn truyền cảm hứng với viền xanh ngọc bên trái */}
          <div className="border-l-[3px] border-[#00A99D] pl-4 sm:pl-5 py-1 space-y-1.5 bg-[#E0F8F3]/40 rounded-r-2xl">
            <p className="text-base italic text-[#102A43] leading-relaxed">
              “Tác phẩm vừa là kết tinh của tâm hồn người sáng tác, vừa là sợi dây truyền cho mọi người sự sống mà nghệ sĩ mang trong lòng.”
            </p>
            <p className="text-xs font-medium text-[#61758A]">
              — Nguyễn Đình Thi, <span className="italic">Tiếng nói của văn nghệ</span>
            </p>
          </div>

          {/* Thẻ giới thiệu chức năng (Educational Card) */}
          <div 
            ref={leftFeatureCardRef}
            className="edu-card spotlight-hover p-5 sm:p-6 rounded-2xl bg-white border border-[#E0EBF4] shadow-xs space-y-3.5"
          >
            <div className="flex items-center space-x-2 text-[#102A43]">
              <CheckCircle2 className="w-5 h-5 text-[#00A99D]" />
              <h3 className="font-bold text-sm sm:text-base">
                Khám phá hành trình học tập trọng tâm:
              </h3>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-[13.5px] text-[#61758A]">
              <li className="flex items-start space-x-2">
                <span className="text-[#00A99D] font-bold mt-0.5">•</span>
                <span>Kho ngữ liệu trọn vẹn Ngữ văn lớp 6, 7, 8, 9.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00A99D] font-bold mt-0.5">•</span>
                <span>Tích hợp bài đọc và câu hỏi đọc hiểu trực quan.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00A99D] font-bold mt-0.5">•</span>
                <span>Hệ thống câu hỏi rèn luyện tư duy 3 mức độ GDPT 2018.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-[#00A99D] font-bold mt-0.5">•</span>
                <span>Luyện đọc biểu cảm với Micro và cô giáo Hà Nội đọc mẫu.</span>
              </li>
              <li className="flex items-start space-x-2 sm:col-span-2">
                <span className="text-[#00A99D] font-bold mt-0.5">•</span>
                <span>Không gian nghe nhạc Lofi êm dịu giúp tĩnh tâm đọc hiểu.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CỘT PHẢI (40% - 45% chiều rộng): KHUNG TƯƠNG TÁC THIẾT KẾ GIỐNG HÌNH 2 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 w-full">
          <div 
            ref={rightCardRef}
            className="edu-card spotlight-hover relative bg-white border border-[#E0EBF4] rounded-3xl p-6 sm:p-8 shadow-md transition-all duration-300"
          >
            {/* Header của Khung */}
            <div className="space-y-1 mb-5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#102A43]">
                {activeCardTab === 'fast-start' ? 'Khởi đầu hành trình đọc hiểu' : 'Đăng nhập học tập'}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#61758A]">
                {activeCardTab === 'fast-start' 
                  ? 'Mỗi trang văn là một hành trình khám phá tri thức.' 
                  : 'Truy cập phòng luyện đọc hiểu và rèn luyện tư duy.'}
              </p>
            </div>

            {/* Tab Chuyển đổi: "Vào học ngay" vs "Đăng nhập" giống Hình 2 */}
            <div className="grid grid-cols-2 p-1 bg-[#F4FAFF] rounded-xl mb-6 text-xs font-bold border border-[#E0EBF4]">
              <button
                type="button"
                onClick={(e) => {
                  createRipple(e);
                  setActiveCardTab('fast-start');
                }}
                className={`py-2 rounded-lg transition-all ripple-container cursor-pointer ${
                  activeCardTab === 'fast-start'
                    ? 'bg-[#00A99D] text-white shadow-xs font-bold'
                    : 'text-[#61758A] hover:text-[#102A43]'
                }`}
              >
                Vào học ngay
              </button>
              <button
                type="button"
                onClick={(e) => {
                  createRipple(e);
                  setActiveCardTab('login');
                }}
                className={`py-2 rounded-lg transition-all ripple-container cursor-pointer ${
                  activeCardTab === 'login'
                    ? 'bg-[#00A99D] text-white shadow-xs font-bold'
                    : 'text-[#61758A] hover:text-[#102A43]'
                }`}
              >
                Đăng nhập tài khoản
              </button>
            </div>

            {/* ======================= CHẾ ĐỘ 1: VÀO HỌC NHANH ======================= */}
            {activeCardTab === 'fast-start' && (
              <form onSubmit={handleStartFast} className="space-y-5">
                {/* Bước 1: Chọn khối lớp (Lưới 2x2) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#102A43] uppercase tracking-wider text-[11px]">
                      Bước 1: Chọn khối lớp
                    </span>
                    <span className="text-[#61758A] font-medium text-[11px]">SGK Kết nối tri thức</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {gradeList.map((item) => {
                      const isSelected = selectedGrade === item.grade;
                      return (
                        <button
                          key={item.grade}
                          type="button"
                          onClick={(e) => {
                            createRipple(e);
                            setSelectedGrade(item.grade);
                          }}
                          className={`relative p-3 rounded-xl border text-left transition-all ripple-container cursor-pointer ${
                            isSelected
                              ? 'border-[#00A99D] bg-[#E0F8F3] shadow-xs ring-2 ring-[#00A99D]/30'
                              : 'border-[#E0EBF4] bg-white hover:border-[#00A99D]/40 hover:bg-[#F4FAFF]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#102A43]">
                              {item.label}
                            </span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-[#00A99D] text-white font-bold' : 'bg-[#EAF6FF] text-[#3285E8]'
                            }`}>
                              Lớp {item.grade}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#61758A] line-clamp-1 mt-1">
                            {item.epTitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bước 2: Nhập tên học sinh */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[#102A43] uppercase tracking-wider">
                    Bước 2: Tên của em
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Nhập tên của em (ví dụ: Mai Anh, Tuấn Minh...)"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-[13px] bg-white border border-[#E0EBF4] rounded-xl text-[#102A43] placeholder-[#94A3B8] focus:outline-none focus:border-[#00A99D] focus:ring-1 focus:ring-[#00A99D] transition-all"
                    />
                  </div>
                </div>

                {/* Bước 3: Chọn linh vật đồng hành */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-[#102A43] uppercase tracking-wider">
                    Bước 3: Chọn bạn đồng hành
                  </label>
                  <div className="flex items-center justify-between gap-1 sm:gap-1.5">
                    {AVATAR_OPTIONS.map((item) => {
                      const avatarEmoji = item.emoji || (item as any).icon;
                      const isSelected = selectedAvatar === avatarEmoji;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(e) => {
                            createRipple(e);
                            setSelectedAvatar(avatarEmoji);
                          }}
                          title={item.label}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-lg flex items-center justify-center transition-all ripple-container cursor-pointer ${
                            isSelected
                              ? 'bg-[#E0F8F3] border-2 border-[#00A99D] shadow-xs scale-105'
                              : 'bg-[#F4FAFF] border border-[#E0EBF4] hover:border-[#00A99D]/50 hover:scale-105'
                          }`}
                        >
                          <span>{avatarEmoji}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bước 4: Nhạc nền Lofi */}
                <div className="p-3 bg-[#F4FAFF] border border-[#E0EBF4] rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-[#E0EBF4] flex items-center justify-center text-[#00A99D]">
                      <Music className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#102A43]">Nhạc nền Lofi Piano êm dịu</p>
                      <p className="text-[10px] text-[#61758A]">Giúp tâm trí tĩnh lặng khi đọc văn</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableChillMusic}
                      onChange={(e) => setEnableChillMusic(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#CBDCEB] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00A99D]"></div>
                  </label>
                </div>

                {/* Bước 5: Nút Bắt đầu hành trình */}
                <button
                  type="submit"
                  onClick={createRipple}
                  className="btn-primary-teal ripple-container w-full py-3 sm:py-3.5 text-xs sm:text-sm flex items-center justify-center space-x-2 tracking-wide cursor-pointer"
                >
                  <span>Bắt đầu hành trình đọc hiểu Lớp {selectedGrade}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>
            )}

            {/* ======================= CHẾ ĐỘ 2: ĐĂNG NHẬP (HÌNH 2) ======================= */}
            {activeCardTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                    {loginError}
                  </div>
                )}

                {/* Email / Tên đăng nhập */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#252420]">
                    Địa chỉ Email hoặc Tên tài khoản
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#77736D]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="hocsinh@thcs.edu.vn"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-[13px] bg-white border border-[#E5DED3] rounded-xl text-[#252420] placeholder-[#A8A29A] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945] transition-all"
                    />
                  </div>
                </div>

                {/* Mật khẩu */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-[#252420]">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => alert('Vui lòng liên hệ giáo viên bộ môn hoặc dùng Đăng nhập nhanh bên dưới.')}
                      className="text-[11px] text-[#77736D] hover:text-[#B88945] underline decoration-dotted"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#77736D]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs sm:text-[13px] bg-white border border-[#E5DED3] rounded-xl text-[#252420] placeholder-[#A8A29A] focus:outline-none focus:border-[#B88945] focus:ring-1 focus:ring-[#B88945] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#77736D] hover:text-[#252420]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Ghi nhớ đăng nhập */}
                <div className="flex items-center space-x-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="rememberDevice"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-[#E5DED3] text-[#252420] focus:ring-[#B88945]"
                  />
                  <label htmlFor="rememberDevice" className="text-xs text-[#77736D] select-none cursor-pointer">
                    Ghi nhớ đăng nhập trên thiết bị này
                  </label>
                </div>

                {/* Nút Đăng nhập phòng học */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={createRipple}
                  className="btn-academic-primary ripple-container w-full py-3 text-xs sm:text-sm flex items-center justify-center space-x-2"
                >
                  <span>{isSubmitting ? 'Đang xác thực...' : 'Đăng nhập phòng học'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                {/* Đường chia cách */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E5DED3]"></div>
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                    <span className="bg-white px-2 text-[#77736D]">hoặc thử nghiệm nhanh</span>
                  </div>
                </div>

                {/* Đăng nhập nhanh theo mẫu Hình 2 */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      createRipple(e);
                      handleQuickDemoStudent();
                    }}
                    className="btn-academic-secondary ripple-container w-full py-2.5 px-3 rounded-xl text-xs flex items-center justify-center space-x-2"
                  >
                    <BookOpen className="w-4 h-4 text-[#B88945]" />
                    <span>Đăng nhập nhanh: Học sinh mẫu (Lớp 7)</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      createRipple(e);
                      handleQuickDemoTeacher();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#E5DED3] bg-white text-xs font-semibold text-[#4A4640] hover:bg-[#F7F5F0] transition-colors flex items-center justify-center space-x-2"
                  >
                    <UserCheck className="w-4 h-4 text-[#77736D]" />
                    <span>Đăng nhập nhanh: Giáo viên mẫu</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onOpenDetailedAuth}
                    className="text-xs text-[#77736D] hover:text-[#B88945] transition-colors"
                  >
                    Chưa có tài khoản? <span className="font-bold underline decoration-dotted text-[#252420]">Đăng ký mới tại đây</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
