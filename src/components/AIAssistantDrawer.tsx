import React, { useState, useRef, useEffect } from 'react';
import { TextItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Compass, 
  Lightbulb, 
  MessageSquare,
  Flame,
  ArrowRight
} from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeText?: TextItem;
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activeText,
  initialPrompt
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Chào ${user?.name || 'em'}! Thầy/Cô ReadMind rất vui được đồng hành cùng em trong môn Ngữ văn. Em có thể nhờ cô giải thích từ khó, hướng dẫn tìm ý chính, tóm tắt bài học hoặc gợi mở cách giải quyết các câu hỏi đọc hiểu nhé!`,
      timestamp: 'Vừa xong'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle external trigger with initialPrompt
  useEffect(() => {
    if (initialPrompt && isOpen) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'u_' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          textTitle: activeText?.title || 'Bài học Ngữ văn THCS',
          textContent: activeText?.content || '',
          grade: user?.grade || 7,
          history: messages.slice(-4).map(m => ({ role: m.role, text: m.text }))
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: 'a_' + Date.now(),
        role: 'assistant',
        text: data.reply || 'Thầy cô luôn sẵn sàng đồng hành cùng em. Em hãy thử nhìn lại các chi tiết trong văn bản nhé!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          text: 'Thầy cô đã nhận được câu hỏi. Em hãy đọc lại đoạn văn vừa rồi xem tác giả dùng từ ngữ nào gợi cảm nhất nhé!',
          timestamp: 'Vừa xong'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col border-l border-[#E0EBF4] animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A99D] to-[#008F85] p-4 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-bold text-sm tracking-wide">ReadMind Assistant</h3>
              <span className="text-[10px] bg-[#FFF2B2] text-[#8C5E00] font-bold px-1.5 py-0.2 rounded">
                AI Socratic
              </span>
            </div>
            <p className="text-[10px] text-white/80">
              {activeText ? `Hỗ trợ bài: ${activeText.title}` : 'Trợ lý đọc hiểu gợi mở'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-2.5 bg-[#F4FAFF] border-b border-[#E0EBF4] flex items-center space-x-1.5 overflow-x-auto text-[11px] font-semibold text-[#61758A]">
        <button
          onClick={() => handleQuickPrompt(activeText ? `Tóm tắt ý chính của bài "${activeText.title}" trong 3 ý ngắn gọn.` : 'Hãy gợi ý cho em phương pháp đọc hiểu Ngữ văn hiệu quả.')}
          className="bg-white hover:bg-[#EAF6FF] hover:text-[#102A43] px-2.5 py-1 rounded-lg border border-[#E0EBF4] shrink-0 transition-colors shadow-2xs cursor-pointer"
        >
          💡 Tóm tắt ý chính
        </button>
        <button
          onClick={() => handleQuickPrompt('Gợi ý cho em cách tìm biện pháp tu từ trong bài này.')}
          className="bg-white hover:bg-[#EAF6FF] hover:text-[#102A43] px-2.5 py-1 rounded-lg border border-[#E0EBF4] shrink-0 transition-colors shadow-2xs cursor-pointer"
        >
          🔍 Biện pháp tu từ
        </button>
        <button
          onClick={() => handleQuickPrompt('Em nên đọc diễn cảm bài này với giọng điệu như thế nào?')}
          className="bg-white hover:bg-[#EAF6FF] hover:text-[#102A43] px-2.5 py-1 rounded-lg border border-[#E0EBF4] shrink-0 transition-colors shadow-2xs cursor-pointer"
        >
          🎙️ Giọng điệu đọc
        </button>
      </div>

      {/* Messages list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F4FAFF]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                m.role === 'user'
                  ? 'bg-[#00A99D] text-white rounded-br-xs'
                  : 'bg-white text-[#102A43] border border-[#E0EBF4] rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-[#61758A] mt-1 px-1">
              {m.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-[#007F76] bg-white p-3 rounded-2xl border border-[#B2EADF] w-fit shadow-xs">
            <Sparkles className="w-4 h-4 animate-spin text-[#00A99D]" />
            <span>ReadMind Assistant đang suy ngẫm câu trả lời...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="p-3 bg-white border-t border-[#E0EBF4] flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hỏi cô/thầy về chi tiết, từ khó trong bài..."
          className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E0EBF4] focus:outline-none focus:border-[#00A99D] focus:ring-1 focus:ring-[#00A99D] bg-[#F4FAFF] text-[#102A43] placeholder-[#94A3B8]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn-primary-teal p-2.5 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
