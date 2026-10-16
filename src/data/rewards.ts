import { RewardItem } from '../types';

export const REWARD_ITEMS: RewardItem[] = [
  // 1. Danh hiệu cao quý
  {
    id: 'title-trang-nguyen',
    title: 'Danh hiệu: Trạng Nguyên Nhí',
    desc: 'Huy hiệu vinh danh học sinh có thành tích đọc hiểu xuất sắc toàn diện.',
    cost: 150,
    icon: '👑',
    type: 'title'
  },
  {
    id: 'title-than-dong',
    title: 'Danh hiệu: Thần Đồng Đọc Hiểu',
    desc: 'Chứng nhận khả năng suy luận và cảm thụ văn học vượt trội.',
    cost: 200,
    icon: '⚡',
    type: 'title'
  },
  {
    id: 'title-thi-si',
    title: 'Danh hiệu: Nhà Thơ Tương Lai',
    desc: 'Dành cho tâm hồn thi ca yêu mến vần thơ và nhạc điệu.',
    cost: 120,
    icon: '🌸',
    type: 'title'
  },

  // 2. Khung Avatar lấp lánh
  {
    id: 'frame-gold',
    title: 'Khung Hoàng Kim Rồng Vàng',
    desc: 'Khung viền ánh kim lấp lánh bao quanh avatar của em trong lớp học.',
    cost: 100,
    icon: '✨',
    type: 'frame'
  },
  {
    id: 'frame-lotus',
    title: 'Khung Hoa Sen Tinh Khiết',
    desc: 'Khung viền đóa hoa sen xanh thanh nhã và thơm ngát.',
    cost: 80,
    icon: '🪷',
    type: 'frame'
  },
  {
    id: 'frame-rainbow',
    title: 'Khung Cầu Vồng Kỳ Diệu',
    desc: 'Khung viền 7 sắc cầu vồng tỏa sáng rực rỡ.',
    cost: 90,
    icon: '🌈',
    type: 'frame'
  },

  // 3. Thẻ trợ giúp & Bảo bối
  {
    id: 'boost-hint',
    title: 'Phao Cứu Sinh Socratic',
    desc: 'Mở khóa ngay gợi ý tư duy sâu sắc từ Trợ lý AI khi gặp câu hỏi khó.',
    cost: 50,
    icon: '🛟',
    type: 'boost'
  },
  {
    id: 'boost-double-xp',
    title: 'Thẻ Nhân Đôi XP (x2)',
    desc: 'Nhân đôi toàn bộ điểm kinh nghiệm nhận được trong 5 bài tập tiếp theo.',
    cost: 70,
    icon: '🚀',
    type: 'boost'
  },

  // 4. Giấy khen điện tử
  {
    id: 'cert-excellence',
    title: 'Giấy Khen Điện Tử ReadMind AI',
    desc: 'Giấy khen danh dự có tên em, công nhận thành tích rèn luyện đọc hiểu theo Chương trình GDPT 2018.',
    cost: 250,
    icon: '📜',
    type: 'certificate'
  }
];
