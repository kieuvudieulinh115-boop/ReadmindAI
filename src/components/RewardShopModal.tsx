import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { REWARD_ITEMS } from '../data/rewards';
import { RewardItem } from '../types';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createRipple } from '../utils/interactiveEffects';
import { AvatarWithFrame } from './AvatarWithFrame';

interface RewardShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RewardShopModal: React.FC<RewardShopModalProps> = ({ isOpen, onClose }) => {
  const { user, spendCoins, equipItem, unequipItem } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [successItem, setSuccessItem] = useState<RewardItem | null>(null);
  const [viewCertificate, setViewCertificate] = useState(false);

  if (!isOpen || !user) return null;

  const currentCoins = user.coins || 0;
  const unlocked = user.unlockedItems || [];

  const handleBuy = (item: RewardItem) => {
    if (unlocked.includes(item.id)) return;
    if (currentCoins < item.cost) {
      alert(`Em cần thêm ${item.cost - currentCoins} xu để đổi vật phẩm này. Hãy tích cực đọc sách và làm bài để nhận thêm xu nhé!`);
      return;
    }

    const success = spendCoins(item.cost, item.id);
    if (success) {
      setSuccessItem(item);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const filteredItems = REWARD_ITEMS.filter(it => 
    selectedCategory === 'all' || it.type === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-[#E5DED3] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#252420] p-5 text-white flex items-center justify-between border-b border-[#3A3833] shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl shadow-xs border border-[#B88945]/40">
              🪙
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-serif-academic font-bold">Cửa Hàng Tri Thức & Đổi Xu</h2>
                <span className="text-[10px] bg-[#B88945] font-bold text-white px-2 py-0.5 rounded-full">
                  ReadMind Shop
                </span>
              </div>
              <p className="text-xs text-[#A6A29A] font-medium">
                Dùng xu thưởng tích luỹ từ học tập để đổi danh hiệu, khung avatar & quà tặng
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-[#FAF7F2] px-3.5 py-1.5 rounded-2xl flex items-center space-x-1.5 font-bold text-[#8B6426] shadow-xs border border-[#B88945]/30">
              <span className="text-base">🪙</span>
              <span className="text-sm sm:text-base">{currentCoins} Xu</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#A6A29A] hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-[#E5DED3] px-6 pt-3 space-x-2 text-xs font-semibold overflow-x-auto bg-[#FAF7F2]">
          {[
            { id: 'all', label: 'Tất cả vật phẩm' },
            { id: 'frame', label: '✨ Khung Avatar' },
            { id: 'title', label: '👑 Danh hiệu' },
            { id: 'boost', label: '🚀 Thẻ Bảo bối' },
            { id: 'certificate', label: '📜 Giấy khen' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={(e) => {
                createRipple(e);
                setSelectedCategory(cat.id);
              }}
              className={`pb-2.5 px-3 border-b-2 transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'border-[#B88945] text-[#252420] font-bold'
                  : 'border-transparent text-[#77736D] hover:text-[#252420]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredItems.map((item) => {
              const isOwned = unlocked.includes(item.id);
              const canAfford = currentCoins >= item.cost;
              const isEquipped = (item.type === 'frame' && user.equippedFrameId === item.id) ||
                                (item.type === 'title' && user.equippedTitleId === item.id);

              return (
                <div
                  key={item.id}
                  className={`academic-card p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isEquipped
                      ? 'bg-[#E0F8F3] border-[#00A99D] ring-2 ring-[#00A99D]/20 shadow-xs'
                      : isOwned
                      ? 'bg-[#FAF7F2] border-[#B88945]/40 shadow-xs'
                      : canAfford
                      ? 'bg-white border-[#E5DED3] hover:border-[#B88945]/60 hover:shadow-xs'
                      : 'bg-[#FAF7F2]/40 border-[#E5DED3] opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Visual representation */}
                    {item.type === 'frame' ? (
                      <div className="p-1 bg-white rounded-xl border border-[#E5DED3] shrink-0">
                        <AvatarWithFrame avatar={user.avatar || '🦉'} frameId={item.id} size="sm" />
                      </div>
                    ) : (
                      <span className="text-3xl p-2 bg-white rounded-xl shadow-2xs shrink-0 border border-[#E5DED3]">
                        {item.icon}
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs sm:text-sm font-serif-academic font-bold text-[#252420] leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-[#77736D] leading-snug font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5DED3]">
                    <div className="flex items-center space-x-1 font-bold text-xs text-[#8B6426]">
                      <span>🪙</span>
                      <span>{item.cost} Xu</span>
                    </div>

                    {isEquipped ? (
                      <div className="flex items-center space-x-1.5">
                        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#00A99D] bg-white px-2.5 py-1 rounded-xl border border-[#00A99D]">
                          <Check className="w-3 h-3 text-[#00A99D]" />
                          <span>Đang sử dụng</span>
                        </span>
                        <button
                          onClick={() => unequipItem(item.type as 'frame' | 'title')}
                          className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Gỡ
                        </button>
                      </div>
                    ) : isOwned ? (
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-bold text-[#8B6426] bg-[#FAF7F2] px-2 py-0.5 rounded-lg border border-[#B88945]/30">
                          Đã sở hữu
                        </span>
                        {(item.type === 'frame' || item.type === 'title') && (
                          <button
                            onClick={() => equipItem(item.id, item.type as 'frame' | 'title')}
                            className="btn-primary-teal px-3 py-1 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Sử dụng
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          createRipple(e);
                          handleBuy(item);
                        }}
                        disabled={!canAfford}
                        className={`ripple-container px-4 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
                          canAfford
                            ? 'btn-academic-primary cursor-pointer'
                            : 'bg-[#F0ECE5] text-[#A6A29A] border border-[#E5DED3] cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Đổi ngay' : 'Chưa đủ xu'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certificate View Trigger */}
          {unlocked.includes('cert-excellence') && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-extrabold text-blue-900 flex items-center space-x-1">
                  <span>📜 Giấy Khen Điện Tử Đã Sẵn Sàng</span>
                </p>
                <p className="text-slate-600">Xem và lưu lại giấy khen vinh danh học sinh xuất sắc của em.</p>
              </div>
              <button
                onClick={() => setViewCertificate(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl shrink-0 shadow-xs cursor-pointer"
              >
                Xem Giấy Khen
              </button>
            </div>
          )}
        </div>

        {/* Purchase Success Modal */}
        {successItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-[#BDE8E0] animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-[#E0F8F3] text-[#00A99D] flex items-center justify-center mx-auto text-3xl">
                {successItem.type === 'frame' ? (
                  <AvatarWithFrame avatar={user.avatar || '🦉'} frameId={successItem.id} size="md" />
                ) : (
                  successItem.icon
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A99D] bg-[#E0F8F3] px-2.5 py-0.5 rounded-full">
                  Đổi quà thành công!
                </span>
                <h3 className="font-serif-academic text-lg font-bold text-[#252420] mt-2">
                  {successItem.title}
                </h3>
                <p className="text-xs text-[#77736D] mt-1">
                  Vật phẩm đã được thêm vào Kho quà và tự động trang bị cho tài khoản của em!
                </p>
              </div>
              <button
                onClick={() => setSuccessItem(null)}
                className="btn-primary-teal w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer"
              >
                Tuyệt vời!
              </button>
            </div>
          </div>
        )}

        {/* Certificate Modal Overlay */}
        {viewCertificate && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-8 rounded-3xl border-4 border-amber-400 max-w-lg w-full text-center space-y-4 shadow-2xl relative">
              <button
                onClick={() => setViewCertificate(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>

              <div className="w-16 h-16 rounded-full bg-amber-100 mx-auto flex items-center justify-center text-3xl shadow-inner border-2 border-amber-300">
                🏆
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-black tracking-widest uppercase text-amber-800">
                  CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </p>
                <p className="text-[10px] text-slate-500">Độc lập - Tự do - Hạnh phúc</p>
              </div>

              <div className="py-2 border-y border-amber-300">
                <h3 className="text-xl font-black text-[#123B8A] tracking-tight uppercase">
                  GIẤY KHEN DANH DỰ
                </h3>
                <p className="text-xs text-slate-600 mt-1">Chứng nhận thành tích luyện đọc hiểu & viết văn xuất sắc</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-slate-500">Trao tặng học sinh:</p>
                <p className="text-2xl font-black text-rose-600">{user.name}</p>
                <p className="text-xs text-slate-600 font-semibold">
                  Học sinh Lớp {user.grade} &bull; Chương trình GDPT 2018 (SGK Kết nối tri thức)
                </p>
                <p className="text-xs text-slate-500 italic pt-1">
                  "Đã kiên trì rèn luyện thói quen đọc hiểu, năng lực tư duy ngôn ngữ và kỹ năng viết bài văn nghị luận xuất sắc trên hệ thống ReadMind AI."
                </p>
              </div>

              <div className="pt-3 flex justify-center">
                <button
                  onClick={() => {
                    alert('Giấy khen đã sẵn sàng! Em có thể chụp màn hình để gửi tặng bố mẹ và thầy cô nhé!');
                  }}
                  className="bg-[#123B8A] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Lưu & Chia Sẻ Giấy Khen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
