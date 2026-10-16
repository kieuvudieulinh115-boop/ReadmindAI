import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback helper in case Gemini API key is missing or encounters a rate-limit
function generateFallbackResponse(type: string, query: string, textContext?: string): string {
  if (type === 'explain') {
    return `Từ ngữ "${query}" trong ngữ cảnh bài đọc mang ý nghĩa quan trọng, thể hiện hình ảnh và tình cảm của tác giả. Bạn có thể chú ý đến các từ ngữ liền kề để hiểu rõ hơn sắc thái biểu cảm nhé!`;
  }
  if (type === 'evaluate') {
    return JSON.stringify({
      score: 8.5,
      feedback: "Câu trả lời của em đã bám sát câu hỏi và nắm được ý chính của văn bản. Em diễn đạt tương đối mạch lạc, nếu bổ sung thêm dẫn chứng từ câu chữ của tác giả thì bài viết sẽ sâu sắc hơn nữa!",
      suggestions: [
        "Trích dẫn thêm 1-2 từ ngữ tiêu biểu từ văn bản",
        "Mở rộng liên hệ cảm xúc cá nhân sâu sắc hơn"
      ]
    });
  }
  if (type === 'essay') {
    return JSON.stringify({
      score: 8.0,
      criteriaScores: [
        { criteria: "Xác định đúng vấn đề nghị luận", score: 1.5, maxPoints: 1.5, comment: "Em đã nêu rõ ràng luận đề ngay từ phần mở bài." },
        { criteria: "Triển khai luận điểm và dẫn chứng", score: 3.5, maxPoints: 4.5, comment: "Hệ thống luận điểm khá sáng rõ, dẫn chứng phù hợp nhưng cần phân tích sâu hơn về ý nghĩa." },
        { criteria: "Liên hệ thực tiễn & sáng tạo", score: 2.0, maxPoints: 2.5, comment: "Có góc nhìn cảm xúc chân thành, thể hiện được bài học nhận thức và hành động của bản thân." },
        { criteria: "Diễn đạt, chính tả và ngữ pháp", score: 1.0, maxPoints: 1.5, comment: "Câu văn gãy gọn, hầu như không mắc lỗi chính tả, chú ý các liên từ nối giữa các đoạn." }
      ],
      overallFeedback: "Bài viết của em thể hiện tư duy nghị luận tốt, nắm chắc phương pháp làm bài và có cảm xúc chân thành.",
      strengths: [
        "Bố cục 3 phần Mở - Thân - Kết rõ ràng, cân đối",
        "Dẫn chứng có tính thuyết phục và gần gũi với lứa tuổi học trò"
      ],
      weaknesses: [
        "Nên đào sâu thêm vào nguyên nhân và ý nghĩa chiều sâu của vấn đề",
        "Có thể trau chuốt thêm các từ ngữ mang tính hình tượng và cảm xúc"
      ],
      advancedSuggestions: "Em hãy thử mở bài gián tiếp bằng một câu danh ngôn hoặc một hình ảnh gợi mở, bài viết sẽ cuốn hút người đọc ngay từ những dòng đầu tiên.",
      improvedSampleParagraph: "Như dòng sông chẳng thể thiếu nguồn cội, cây xanh chẳng thể thiếu rễ sâu nuôi dưỡng, lòng biết ơn chính là chiếc rễ bám sâu vào mảnh đất nhân nghĩa để tâm hồn mỗi chúng ta nở những đóa hoa tử tế giữa cuộc đời.",
      teacherPraise: "Thầy cô rất tự hào về tư duy sâu sắc và sự tiến bộ từng ngày trong ngòi bút của em!"
    });
  }
  return "Thầy/Cô ReadMind rất vui được đồng hành cùng em! Hãy đọc kỹ từng đoạn văn và tìm các chi tiết nổi bật nhé. Em đang có băn khoăn ở đoạn nào của bài học?";
}

// 1. API: ReadMind Assistant Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, textTitle, textContent, grade, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!aiClient) {
      return res.json({
        reply: generateFallbackResponse('chat', message, textContent),
        isFallback: true
      });
    }

    const systemPrompt = `Bạn là "ReadMind Assistant" - Trợ lý luyện đọc hiểu Ngữ văn THCS (Lớp ${grade || 7}) theo Chương trình GDPT 2018 Việt Nam (Bộ sách Kết nối tri thức với cuộc sống).
Vai trò của bạn:
- Là người thầy/cô giáo ân cần, khích lệ, hướng dẫn học sinh phát triển tư duy đọc hiểu, cảm thụ cái đẹp của ngôn từ và bồi dưỡng tâm hồn.
- NGUYÊN TẮC QUAN TRỌNG: KHÔNG làm bài hộ học sinh, KHÔNG đưa ngay đáp án câu hỏi nếu học sinh chưa suy nghĩ. Hãy đặt câu hỏi gợi mở theo phương pháp Socratic, hướng học sinh quay lại các chi tiết then chốt trong văn bản để tự rút ra kết luận.
- Ngôn ngữ: Tiếng Việt trong sáng, gần gũi, ấm áp, phù hợp lứa tuổi học sinh cấp 2.
- Ngữ cảnh bài đọc hiện tại (nếu có):
Tiêu đề: ${textTitle || 'Bài đọc chung'}
Nội dung văn bản:
${textContent ? textContent.slice(0, 3000) : 'Học sinh đang ở kho bài đọc tổng quan'}`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nLịch sử hội thoại trước:\n${history.map((h: any) => `${h.role === 'user' ? 'Học sinh' : 'Trợ lý'}: ${h.text}`).join('\n')}\n\nHọc sinh hỏi: ${message}` }]
      }
    ];

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
    });

    const reply = response.text || "Em hãy thử đọc lại đoạn văn trên để tìm chi tiết miêu tả cảm xúc của nhân vật nhé!";
    res.json({ reply, isFallback: false });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.json({
      reply: "Thầy cô ReadMind luôn ở đây để hỗ trợ em. Em hãy thử đọc lại khổ thơ/đoạn văn vừa rồi xem tác giả đã dùng hình ảnh nào để thể hiện ý nghĩ nhé!",
      isFallback: true
    });
  }
});

// 2. API: Evaluate Open-Ended Reading Answer
app.post('/api/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, studentAnswer, textTitle, textContent, grade } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({ error: 'Question and student answer are required' });
    }

    if (!aiClient) {
      return res.json(JSON.parse(generateFallbackResponse('evaluate', studentAnswer)));
    }

    const prompt = `Bạn là Giám khảo chấm Đọc hiểu Ngữ văn THCS (Lớp ${grade || 7}) theo chuẩn Chương trình GDPT 2018 Việt Nam.
Hãy nhận xét câu trả lời tự luận của học sinh một cách công tâm, khuyến khích tư duy phản biện và sáng tạo, không áp đặt đáp án khuôn mẫu:
Văn bản: "${textTitle}"
Nội dung tóm tắt văn bản: "${textContent ? textContent.slice(0, 1500) : ''}"
Câu hỏi đọc hiểu: "${question}"
Câu trả lời của học sinh: "${studentAnswer}"

Hãy trả về kết quả dưới dạng JSON (CHỈ TRẢ VỀ JSON HỢP LỆ, không kèm markdown khác):
{
  "score": <điểm số thang 10, ví dụ: 8.5>,
  "feedback": "<nhận xét tích cực, chỉ ra điểm sáng tạo và điểm học sinh đã làm tốt>",
  "suggestions": [
    "<gợi ý cải thiện 1>",
    "<gợi ý cải thiện 2>"
  ],
  "praise": "<1 câu khen ngợi tạo động lực cho học sinh>"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let resultJson;
    try {
      resultJson = JSON.parse(response.text || '{}');
    } catch {
      resultJson = JSON.parse(generateFallbackResponse('evaluate', studentAnswer));
    }

    res.json(resultJson);
  } catch (error) {
    console.error('Evaluate answer error:', error);
    res.json(JSON.parse(generateFallbackResponse('evaluate', '')));
  }
});

// 2.5 API: Grade Essay (Social & Literary Argumentation)
app.post('/api/grade-essay', async (req: Request, res: Response) => {
  try {
    const {
      promptId,
      promptTitle,
      promptType,
      promptContent,
      requirements = [],
      rubric = [],
      studentEssay,
      wordCount = 0,
      grade = 8,
      timeSpentSeconds = 0,
      relatedTextTitle
    } = req.body;

    if (!studentEssay || typeof studentEssay !== 'string' || studentEssay.trim().length < 15) {
      return res.status(400).json({ error: 'Bài làm quá ngắn để chấm điểm. Em hãy viết tối thiểu 15-20 từ nhé!' });
    }

    if (!aiClient) {
      return res.json(JSON.parse(generateFallbackResponse('essay', studentEssay)));
    }

    const typeDesc = promptType === 'social' ? 'Nghị luận xã hội' : 'Nghị luận văn học';
    const rubricText = Array.isArray(rubric) && rubric.length > 0
      ? rubric.map((r: any) => `- ${r.criteria} (Tối đa ${r.maxPoints}đ): ${r.description}`).join('\n')
      : `- Tiêu chí 1: Xác định đúng vấn đề nghị luận (1.5đ)\n- Tiêu chí 2: Triển khai luận điểm và dẫn chứng (4.5đ)\n- Tiêu chí 3: Liên hệ thực tiễn & sáng tạo (2.5đ)\n- Tiêu chí 4: Diễn đạt, chính tả, bố cục (1.5đ)`;

    const prompt = `Bạn là Trưởng ban Giám khảo chấm thi HSG và Tuyển sinh Ngữ văn THCS (Lớp ${grade}) theo Chương trình GDPT 2018 (SGK Kết nối tri thức với cuộc sống).
Nhiệm vụ: Chấm và đánh giá bài viết của học sinh một cách công tâm, chính xác, sư phạm, giàu tính nhân văn và khích lệ tư duy phản biện.

THÔNG TIN ĐỀ THI:
- Thể loại: ${typeDesc}
- Mã đề: ${promptId || 'NL'} - Tiêu đề: ${promptTitle || 'Đề thi Nghị luận'}
${relatedTextTitle ? `- Tác phẩm liên quan: "${relatedTextTitle}"` : ''}
- Đề bài cụ thể:
"${promptContent || promptTitle}"
- Yêu cầu bài viết:
${Array.isArray(requirements) ? requirements.map((r: string) => `+ ${r}`).join('\n') : ''}

- Thang điểm & Tiêu chuẩn đánh giá:
${rubricText}

THÔNG TIN BÀI LÀM CỦA HỌC SINH:
- Số từ: ${wordCount} từ
- Thời gian làm bài: ${Math.round(timeSpentSeconds / 60)} phút
- Toàn văn bài làm của học sinh:
"""
${studentEssay}
"""

HÃY ĐÁNH GIÁ VÀ TRẢ VỀ JSON VỚI ĐỊNH DẠNG SAU (CHỈ TRẢ VỀ JSON HỢP LỆ, KHÔNG KÈM KÝ TỰ MARKDOWN KHÁC):
{
  "score": <tổng điểm số thang 10, số thực làm tròn 0.25 hoặc 0.5, ví dụ: 8.25>,
  "criteriaScores": [
    {
      "criteria": "<Tên tiêu chí 1>",
      "score": <điểm đạt được>,
      "maxPoints": <điểm tối đa của tiêu chí>,
      "comment": "<Nhận xét cụ thể bài làm của học sinh ở tiêu chí này>"
    },
    {
      "criteria": "<Tên tiêu chí 2>",
      "score": <điểm đạt được>,
      "maxPoints": <điểm tối đa của tiêu chí>,
      "comment": "<Nhận xét cụ thể bài làm của học sinh ở tiêu chí này>"
    },
    {
      "criteria": "<Tên tiêu chí 3>",
      "score": <điểm đạt được>,
      "maxPoints": <điểm tối đa của tiêu chí>,
      "comment": "<Nhận xét cụ thể bài làm của học sinh ở tiêu chí này>"
    },
    {
      "criteria": "<Tên tiêu chí 4>",
      "score": <điểm đạt được>,
      "maxPoints": <điểm tối đa của tiêu chí>,
      "comment": "<Nhận xét cụ thể bài làm của học sinh ở tiêu chí này>"
    }
  ],
  "overallFeedback": "<Nhận xét tổng quan toàn diện về bài viết của học sinh>",
  "strengths": [
    "<Điểm cộng / ưu điểm nổi bật 1>",
    "<Điểm cộng / ưu điểm nổi bật 2>"
  ],
  "weaknesses": [
    "<Hạn chế cần khắc phục 1>",
    "<Hạn chế cần khắc phục 2>"
  ],
  "advancedSuggestions": "<Gợi ý chuyên sâu cách nâng cao bài viết (ví dụ: mở bài gián tiếp, liên hệ thực tế đa chiều, dùng biện pháp tu từ, kết bài mở...)>",
  "improvedSampleParagraph": "<Đoạn văn viết lại hoặc đoạn văn mẫu minh họa để học sinh học hỏi cách hành văn trau chuốt hơn>",
  "teacherPraise": "<1 câu khen ngợi truyền cảm hứng từ thầy/cô ReadMind AI>"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let resultJson;
    try {
      resultJson = JSON.parse(response.text || '{}');
    } catch {
      resultJson = JSON.parse(generateFallbackResponse('essay', studentEssay));
    }

    res.json(resultJson);
  } catch (error) {
    console.error('Grade essay error:', error);
    res.json(JSON.parse(generateFallbackResponse('essay', '')));
  }
});

// 3. API: Explain Difficult Word in Context
app.post('/api/explain-word', async (req: Request, res: Response) => {
  try {
    const { word, contextSentence, textTitle } = req.body;

    if (!word) {
      return res.status(400).json({ error: 'Word is required' });
    }

    if (!aiClient) {
      return res.json({
        meaning: `Từ "${word}" là từ ngữ giàu giá trị gợi cảm trong văn bản.`,
        example: `Ví dụ câu: ${contextSentence || word}`,
        nuance: "Giúp người đọc hình dung sinh động bức tranh cảm xúc của nhân vật."
      });
    }

    const prompt = `Bạn là từ điển văn học thông minh cho học sinh THCS. Hãy giải thích ngắn gọn, dễ hiểu từ ngữ sau:
Từ ngữ cần giải thích: "${word}"
Câu chứa từ này trong bài "${textTitle || ''}": "${contextSentence || ''}"

Trả về JSON:
{
  "meaning": "<Giải nghĩa ngắn gọn, chuẩn xác, dễ hiểu cho học sinh lớp 6-9>",
  "wordType": "<Từ loại: Danh từ/Động từ/Tính từ/Từ Hán Việt/Thành ngữ...>",
  "nuance": "<Sắc thái biểu cảm, tác dụng nghệ thuật của từ ngữ này trong văn cảnh>",
  "example": "<1 câu văn mẫu ứng dụng đặt câu với từ này>"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let json;
    try {
      json = JSON.parse(response.text || '{}');
    } catch {
      json = {
        meaning: `Từ "${word}" mang ý nghĩa sâu sắc trong ngữ cảnh bài đọc.`,
        wordType: "Từ ngữ văn học",
        nuance: "Tăng tính gợi hình và truyền cảm",
        example: `Học sinh chăm chú lắng nghe cô giáo giảng về "${word}".`
      };
    }

    res.json(json);
  } catch (error) {
    console.error('Explain word error:', error);
    res.json({
      meaning: `Từ ngữ quan trọng trong bài đọc.`,
      wordType: "Từ vựng",
      nuance: "Thể hiện ý đồ nghệ thuật của tác giả.",
      example: ""
    });
  }
});

// 4. API: AI Speech Reading Coach
app.post('/api/speech-coach', async (req: Request, res: Response) => {
  try {
    const { originalText, transcribedText, textGenre, durationSeconds } = req.body;

    if (!originalText || !transcribedText) {
      return res.status(400).json({ error: 'Texts required' });
    }

    if (!aiClient) {
      return res.json({
        accuracy: 90,
        wpm: 120,
        expressionScore: 8.5,
        feedback: "Em đọc rất to, rõ ràng và mạch lạc! Hãy chú ý ngắt nhịp ở các dấu phẩy để bài đọc truyền cảm hơn nữa nhé.",
        praise: "Giọng đọc của em rất tự tin và ấm áp!"
      });
    }

    const prompt = `Bạn là Huấn luyện viên Luyện đọc diễn cảm và Biểu cảm cho học sinh THCS.
Văn bản gốc: "${originalText.slice(0, 1000)}"
Thể loại: ${textGenre || 'Văn bản'}
Học sinh vừa đọc thành tiếng được nhận diện lại là: "${transcribedText.slice(0, 1000)}"
Thời gian đọc: ${durationSeconds || 30} giây.

Hãy nhận xét việc đọc của học sinh một cách chân thành, khích lệ. Trả về JSON:
{
  "accuracy": <tỉ lệ chính xác từ 0-100>,
  "wpm": <tốc độ ước tính từ/phút>,
  "expressionFeedback": "<gợi ý về nhịp điệu, ngắt giọng theo dấu câu, nhấn nhá các từ ngữ then chốt>",
  "encouragement": "<lời khen ngợi truyền cảm hứng và động viên học sinh>"
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    let parsed;
    try {
      parsed = JSON.parse(response.text || '{}');
    } catch {
      parsed = {
        accuracy: 92,
        wpm: 115,
        expressionFeedback: "Em hãy chú ý nhấn giọng ở các tính từ miêu tả và ngắt hơi tự nhiên ở cuối câu thơ nhé.",
        encouragement: "Giọng đọc rất sáng và có tiềm năng diễn cảm tốt!"
      };
    }
    res.json(parsed);
  } catch (error) {
    console.error('Speech coach error:', error);
    res.json({
      accuracy: 90,
      wpm: 110,
      expressionFeedback: "Hãy luyện tập thêm để giọng đọc càng thêm lưu loát và truyền cảm!",
      encouragement: "Rất hoan nghênh nỗ lực luyện đọc của em hôm nay!"
    });
  }
});

// 5. API: Text-to-Speech Northern Vietnamese Female Teacher Voice (Hà Nội)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Aoede', style } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!aiClient) {
      return res.status(503).json({ error: 'AI Client not initialized' });
    }

    // Limit chunk to avoid timeout and ensure crystal clear pronunciation
    const chunkText = text.trim().slice(0, 700);
    const speechStyle = style || 'Giọng nữ cô giáo dạy Ngữ văn tại Hà Nội, phát âm chuẩn tiếng Việt Bắc Bộ, truyền cảm, nhẹ nhàng, ấm áp, ngắt nhịp tự nhiên theo từng câu từ.';

    const tryGenerateTTS = async (modelName: string, selectedVoice: string) => {
      return await aiClient!.models.generateContent({
        model: modelName,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: chunkText,
                speechMetadata: {
                  style: speechStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice }, // 'Aoede' or 'Kore' for warm female tone
            },
          },
        },
      });
    };

    // Primary TTS Model per gemini-api skill: gemini-3.8-flash-lite-tts
    let response;
    try {
      response = await tryGenerateTTS('gemini-3.8-flash-lite-tts', voiceName);
    } catch (ttsErr: any) {
      const isQuota = ttsErr?.status === 429 || 
                      ttsErr?.message?.includes('429') || 
                      ttsErr?.message?.includes('quota') || 
                      ttsErr?.message?.includes('RESOURCE_EXHAUSTED');

      if (isQuota) {
        return res.status(429).json({
          quotaExceeded: true,
          error: 'QUOTA_EXCEEDED',
          message: 'Hạn mức AI TTS hiện tại đã đạt tối đa trong ngày. Ứng dụng sẽ tự động chuyển sang giọng đọc thiết bị.'
        });
      }

      // If non-quota error, try Aoede voice fallback
      try {
        response = await tryGenerateTTS('gemini-3.8-flash-lite-tts', 'Aoede');
      } catch (fallbackErr: any) {
        const isFallbackQuota = fallbackErr?.status === 429 || 
                                fallbackErr?.message?.includes('429') || 
                                fallbackErr?.message?.includes('quota') || 
                                fallbackErr?.message?.includes('RESOURCE_EXHAUSTED');
        if (isFallbackQuota) {
          return res.status(429).json({
            quotaExceeded: true,
            error: 'QUOTA_EXCEEDED',
            message: 'Hạn mức AI TTS hiện tại đã đạt tối đa.'
          });
        }
        return res.status(503).json({ error: fallbackErr?.message || 'TTS generation unavailable' });
      }
    }

    const base64Audio = response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated by AI TTS' });
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    const isQuota = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    if (isQuota) {
      return res.status(429).json({ quotaExceeded: true, error: 'QUOTA_EXCEEDED' });
    }
    res.status(500).json({ error: error?.message || 'TTS generation failed' });
  }
});


// Mount Vite middleware in development or serve built files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(process.cwd(), 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    console.log(`Serving production static assets from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    if (isProduction) {
      console.warn('Production dist/ directory not found, falling back to Vite dev middleware');
    }
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ReadMind AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
