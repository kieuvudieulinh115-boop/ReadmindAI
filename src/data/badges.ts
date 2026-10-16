import { Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first-read',
    title: 'Mầm Non Tri Thức',
    description: 'Hoàn thành bài đọc đầu tiên trên ReadMind AI',
    icon: '🌱',
    unlockedAt: new Date().toISOString()
  },
  {
    id: 'streak-3',
    title: 'Ngọn Lửa Kiên Trì',
    description: 'Duy trì chuỗi học tập 3 ngày liên tiếp',
    icon: '🔥'
  },
  {
    id: 'voice-star',
    title: 'Giọng Đọc Ngọt Ngào',
    description: 'Luyện đọc thành tiếng đạt độ chính xác trên 85%',
    icon: '🎙️'
  },
  {
    id: 'quiz-master',
    title: 'Bậc Thầy Đọc Hiểu',
    description: 'Đạt điểm tuyệt đối ở phần câu hỏi tư duy',
    icon: '🏆'
  },
  {
    id: 'poet-heart',
    title: 'Tâm Hồn Thi Sĩ',
    description: 'Luyện đọc diễn cảm một bài thơ theo nhịp điệu',
    icon: '🌸'
  },
  {
    id: 'word-detective',
    title: 'Thám Tử Từ Khóa',
    description: 'Chiến thắng trò chơi "Truy tìm từ khóa" hoặc "Giải mã thông điệp"',
    icon: '🔍'
  },
  {
    id: 'book-lover',
    title: 'Nhà Độc Giả Thông Thái',
    description: 'Khám phá và hoàn thành 5 bài đọc khác nhau',
    icon: '📚'
  }
];

export const AVATAR_OPTIONS = [
  { id: 'av-cat', label: 'Mèo Thông Thái', emoji: '🐱', bg: 'bg-amber-100 text-amber-600' },
  { id: 'av-owl', label: 'Cú Vọ Học Giả', emoji: '🦉', bg: 'bg-indigo-100 text-indigo-600' },
  { id: 'av-fox', label: 'Cáo Nhanh Trí', emoji: '🦊', bg: 'bg-orange-100 text-orange-600' },
  { id: 'av-bear', label: 'Gấu Chăm Chỉ', emoji: '🐻', bg: 'bg-emerald-100 text-emerald-600' },
  { id: 'av-robot', label: 'Robot ReadMind', emoji: '🤖', bg: 'bg-blue-100 text-blue-600' },
  { id: 'av-dragon', label: 'Rồng Thăng Long', emoji: '🐉', bg: 'bg-rose-100 text-rose-600' },
  { id: 'av-star', label: 'Ngôi Sao Sáng', emoji: '⭐', bg: 'bg-yellow-100 text-yellow-600' }
];
