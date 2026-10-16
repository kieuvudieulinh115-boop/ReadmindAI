import { EssayPrompt } from '../types';

export const ESSAY_PROMPTS: EssayPrompt[] = [
  // ===================== A. NGHỊ LUẬN XÃ HỘI =====================
  {
    id: 'NLXH-BIET-ON',
    type: 'social',
    title: 'Ý nghĩa của lòng biết ơn trong cuộc sống',
    topic: 'Lòng biết ơn',
    grade: 8,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Nhà văn La Bruyère từng nói: "Lòng biết ơn là một trong những đức tính cao quý nhất của con người". Bằng hiểu biết và trải nghiệm thực tế, em hãy viết một bài văn (hoặc đoạn văn khoảng 250 - 300 chữ) bàn về ý nghĩa của lòng biết ơn đối với sự hoàn thiện nhân cách của mỗi học sinh.',
    requirements: [
      'Giải thích khái niệm lòng biết ơn là gì.',
      'Phân tích vì sao con người cần có lòng biết ơn (đối với cha mẹ, thầy cô, thế hệ đi trước).',
      'Đưa ra ít nhất 1-2 dẫn chứng cụ thể, xác thực từ đời sống thực tế hoặc lịch sử.',
      'Phê phán hiện tượng vô ơn, bội bạc, vong ân bội nghĩa.',
      'Rút ra bài học nhận thức và hành động thiết thực cho bản thân.'
    ],
    rubric: [
      { criteria: 'Xác định đúng vấn đề nghị luận', maxPoints: 1.5, description: 'Nêu rõ vấn đề lòng biết ơn và vai trò của nó ngay từ mở bài.' },
      { criteria: 'Triển khai luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Luận điểm mạch lạc, giải thích thấu đáo, dẫn chứng tiêu biểu và thuyết phục.' },
      { criteria: 'Liên hệ bản thân & sáng tạo', maxPoints: 2.5, description: 'Bài học chân thành, giàu cảm xúc, có cái nhìn đa chiều về cuộc sống.' },
      { criteria: 'Diễn đạt & chính tả ngữ pháp', maxPoints: 1.5, description: 'Văn phong trong sáng, dùng từ chính xác, cấu trúc câu chặt chẽ.' }
    ]
  },
  {
    id: 'NLXH-YEU-THUONG',
    type: 'social',
    title: 'Sức mạnh của tình yêu thương và sự sẻ chia',
    topic: 'Tình yêu thương',
    grade: 7,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Có ý kiến cho rằng: "Sống trong đời sống cần có một tấm lòng, để làm gì em biết không? Để gió cuốn đi..." (Trịnh Công Sơn). Em hãy viết bài văn nghị luận bàn về sức mạnh diệu kỳ của tình yêu thương và tinh thần sẻ chia trong xã hội hiện nay.',
    requirements: [
      'Nêu rõ khái niệm và biểu hiện của tình yêu thương, sự sẻ chia trong gia đình, trường học và cộng đồng.',
      'Phân tích ý nghĩa: Tình yêu thương xoa dịu nỗi đau, gắn kết con người, thắp sáng niềm tin hy vọng.',
      'Dẫn chứng thực tế: Các phong trào tương thân tương ái, cứu trợ đồng bào lũ lụt, giúp đỡ bạn nghèo...',
      'Mở rộng: Yêu thương không đồng nghĩa với nuông chiều mù quáng; sẻ chia phải xuất phát từ sự chân thành.',
      'Liên hệ bản thân: Em đã và sẽ làm gì để lan tỏa yêu thương mỗi ngày?'
    ],
    rubric: [
      { criteria: 'Xác định đúng vấn đề nghị luận', maxPoints: 1.5, description: 'Nêu đúng vai trò của tình yêu thương trong cuộc sống.' },
      { criteria: 'Triển khai luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Lí lẽ sâu sắc, dẫn chứng chân thực cảm động.' },
      { criteria: 'Liên hệ bản thân & sáng tạo', maxPoints: 2.5, description: 'Cảm xúc tự nhiên, lời văn truyền cảm hứng.' },
      { criteria: 'Diễn đạt & ngữ pháp', maxPoints: 1.5, description: 'Bố cục cân đối, không sai chính tả.' }
    ]
  },
  {
    id: 'NLXH-TRACH-NHIEM',
    type: 'social',
    title: 'Tinh thần trách nhiệm của người trẻ tuổi',
    topic: 'Tinh thần trách nhiệm',
    grade: 9,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Đại văn hào Lev Tolstoy từng khẳng định: "Thước đo giá trị của một con người là tinh thần trách nhiệm mà người đó mang lại cho xã hội". Em hãy viết bài văn nghị luận trình bày suy nghĩ về tinh thần trách nhiệm của học sinh THCS hôm nay đối với bản thân, gia đình và cộng đồng.',
    requirements: [
      'Giải thích tinh thần trách nhiệm: Ý thức hoàn thành nhiệm vụ và dám chịu trách nhiệm về hành vi của mình.',
      'Bàn luận 3 phương diện: Trách nhiệm với chính mình (học tập, sức khỏe), gia đình (hiếu thảo, đỡ đần cha mẹ), xã hội (tuân thủ pháp luật, bảo vệ của công).',
      'Dẫn chứng về những tấm gương thanh thiếu niên sống trách nhiệm, cống hiến vì cộng đồng.',
      'Phản biện lối sống vô cảm, đùn đẩy trách nhiệm, đổ lỗi cho hoàn cảnh.',
      'Đề xuất hành động thiết thực của bản thân.'
    ],
    rubric: [
      { criteria: 'Xác định đúng vấn đề', maxPoints: 1.5, description: 'Xác định chính xác tinh thần trách nhiệm của thanh thiếu niên.' },
      { criteria: 'Hệ thống luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Lập luận sắc bén, đa diện, dẫn chứng thuyết phục.' },
      { criteria: 'Chiều sâu tư tưởng & sáng tạo', maxPoints: 2.5, description: 'Thể hiện bản lĩnh tư duy và góc nhìn phản biện trưởng thành.' },
      { criteria: 'Kỹ năng trình bày', maxPoints: 1.5, description: 'Mạch văn trôi chảy, lập luận chặt chẽ.' }
    ]
  },
  {
    id: 'NLXH-TRUNG-THUC',
    type: 'social',
    title: 'Giá trị của sự trung thực trong học đường và cuộc sống',
    topic: 'Sự trung thực',
    grade: 8,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Tục ngữ Việt Nam có câu: "Cây ngay không sợ chết đứng". Ngạn ngữ phương Tây cũng có câu: "Sự trung thực là trang sách đầu tiên trong cuốn sách của sự khôn ngoan". Hãy viết bài văn bàn về ý nghĩa của tính trung thực và tác hại của thói dối trá trong học đường hiện nay.',
    requirements: [
      'Giải thích trung thực là gì (tôn trọng sự thật, không gian dối, lời nói đi đôi với việc làm).',
      'Phân tích giá trị: Tạo dựng niềm tin, sự tôn trọng từ bạn bè, thầy cô; xây dựng tâm hồn thanh thản.',
      'Chỉ ra thực trạng: Gian lận trong thi cử, nói dối cha mẹ để chơi game, trốn tránh lỗi lầm.',
      'Hậu quả của sự dối trá: Đánh mất nhân cách, mất uy tín, ảnh hưởng đến tương lai bản thân.',
      'Bài học rèn luyện lòng trung thực từ những việc nhỏ nhất.'
    ],
    rubric: [
      { criteria: 'Xác định đúng vấn đề', maxPoints: 1.5, description: 'Làm nổi bật giá trị của lòng trung thực.' },
      { criteria: 'Triển khai luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Bám sát thực tế học đường, lập luận thuyết phục.' },
      { criteria: 'Bài học & liên hệ', maxPoints: 2.5, description: 'Gắn liền với trải nghiệm rèn luyện của bản thân.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Văn phong chuẩn mực, gãy gọn.' }
    ]
  },
  {
    id: 'NLXH-NGHI-LUC',
    type: 'social',
    title: 'Ý chí, nghị lực vượt khó – Chìa khóa chạm tới ước mơ',
    topic: 'Nghị lực vượt khó',
    grade: 9,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Nhà bác học Thomas Edison từng đúc kết: "Thiên tài chỉ có 1% là cảm hứng, 99% còn lại là mồ hôi và nước mắt". Em hãy viết bài văn nghị luận bàn về vai trò quyết định của ý chí, nghị lực đối với thành công của mỗi con người trên con đường chinh phục ước mơ.',
    requirements: [
      'Giải thích ý chí, nghị lực vượt khó là gì.',
      'Khẳng định vai trò: Nghịch cảnh là lò luyện vàng; người có nghị lực luôn biến khó khăn thành cơ hội phát triển.',
      'Dẫn chứng tiêu biểu: Thầy giáo Nguyễn Ngọc Ký, nhà vật lý Stephen Hawking, kình ngư Ánh Viên hoặc những tấm gương vượt khó học giỏi quanh em.',
      'Phê phán tư tưởng lười nhác, mau chán nản, ỷ lại và sớm đầu hàng trước trở ngại.',
      'Bài học hành động cho bản thân khi đứng trước một bài toán khó hay một thất bại.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Khẳng định vai trò cốt lõi của ý chí vượt khó.' },
      { criteria: 'Luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Dẫn chứng sinh động, phân tích thấu đáo sức mạnh nội tâm.' },
      { criteria: 'Cảm hứng & sáng tạo', maxPoints: 2.5, description: 'Giọng văn truyền nhiệt huyết, cảm xúc mạnh mẽ.' },
      { criteria: 'Kỹ năng trình bày', maxPoints: 1.5, description: 'Liên kết đoạn hợp lý, câu từ trong sáng.' }
    ]
  },
  {
    id: 'NLXH-MANG-XA-HOI',
    type: 'social',
    title: 'Văn hóa ứng xử của học sinh trên không gian mạng',
    topic: 'Văn hóa ứng xử trên mạng xã hội',
    grade: 9,
    difficulty: 'Nâng cao',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Mạng xã hội (Facebook, TikTok, YouTube...) đang mở ra thế giới kết nối vô tận nhưng cũng tiềm ẩn nhiều cạm bẫy với những bình luận ác ý, bắt nạt trực tuyến và tin giả. Em hãy viết bài văn nghị luận bàn về trách nhiệm và văn hóa ứng xử văn minh của học sinh THCS trên không gian mạng.',
    requirements: [
      'Nêu bức tranh thực tế việc sử dụng mạng xã hội của học sinh hiện nay (mặt tích cực và mặt trái).',
      'Bàn về "văn hóa ứng xử văn minh trên mạng": Tôn trọng sự thật, không lăng mạ xúc phạm người khác, không chia sẻ tin giả vô căn cứ.',
      'Tác hại của bạo lực mạng: Gây tổn thương tâm lý nghiêm trọng, hủy hoại danh dự người khác.',
      'Nguyên tắc: "Uốn ngón tay bảy lần trước khi gõ phím".',
      'Đề xuất giải pháp và lời hứa hành động làm chủ công nghệ một cách thông minh.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Bắt đúng vấn đề thời sự nóng bỏng của lứa tuổi học sinh.' },
      { criteria: 'Luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Lí lẽ sâu sắc, dẫn chứng thời sự có sức nặng thuyết phục.' },
      { criteria: 'Góc nhìn phản biện & giải pháp', maxPoints: 2.5, description: 'Đề xuất giải pháp thiết thực, mang tính xây dựng cao.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Ngôn từ chuẩn mực, lập luận chặt chẽ.' }
    ]
  },
  {
    id: 'NLXH-TRI-TUE-NHAN-TAO',
    type: 'social',
    title: 'Học sinh làm chủ Trí tuệ nhân tạo (AI) trong kỷ nguyên số',
    topic: 'Sử dụng công nghệ và trí tuệ nhân tạo',
    grade: 8,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Sự bùng nổ của các công cụ Trí tuệ nhân tạo (AI) như ChatGPT hay ReadMind AI đang thay đổi cách con người học tập và làm việc. Có người lo ngại học sinh sẽ lười suy nghĩ, nhưng cũng có người coi đây là người bạn đồng hành đắc lực. Em hãy viết bài văn nêu suy nghĩ về cách học sinh nên ứng xử và tận dụng AI một cách thông minh, chính trực.',
    requirements: [
      'Giải thích hiện tượng AI đang đi vào đời sống học đường như thế nào.',
      'Hai mặt của vấn đề: AI mở ra kho tàng tri thức, giải đáp tức thì; nhưng nếu lạm dụng để chép bài làm hộ sẽ triệt tiêu tư duy độc lập và năng lực sáng tạo.',
      'Khẳng định: "AI là công cụ hỗ trợ tư duy, không thể thay thế bộ óc và trái tim con người".',
      'Định hướng cách học cùng AI: Đặt câu hỏi gợi mở, mở rộng kiến thức, kiểm chứng thông tin, giữ gìn sự trung thực học thuật.',
      'Liên hệ bản thân trong quá trình học tập hàng ngày.'
    ],
    rubric: [
      { criteria: 'Xác định đúng vấn đề', maxPoints: 1.5, description: 'Nêu rõ thách thức và cơ hội của AI với học sinh.' },
      { criteria: 'Triển khai luận điểm', maxPoints: 4.5, description: 'Phân tích đa chiều, khách quan, có lí có tình.' },
      { criteria: 'Sáng tạo & tư duy tương lai', maxPoints: 2.5, description: 'Góc nhìn hiện đại, truyền cảm hứng tự học tự chủ.' },
      { criteria: 'Kỹ năng diễn đạt', maxPoints: 1.5, description: 'Lập luận sắc bén, câu từ mạch lạc.' }
    ]
  },
  {
    id: 'NLXH-BAO-LUC-HOC-DUONG',
    type: 'social',
    title: 'Xây dựng trường học hạnh phúc – Nói không với bạo lực học đường',
    topic: 'Bạo lực học đường',
    grade: 7,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Bạo lực học đường (cả về thể xác lẫn tinh thần) vẫn đang là nỗi nhức nhối làm vấy bẩn môi trường giáo dục trong sáng. Em hãy viết bài văn bàn về nguyên nhân, hậu quả và giải pháp để cùng nhau xây dựng "Trường học hạnh phúc – Nơi tình bạn thăng hoa".',
    requirements: [
      'Khái quát thực trạng và biểu hiện của bạo lực học đường (đánh nhau, tẩy chay cô lập bạn, chửi bới xúc phạm...).',
      'Nguyên nhân: Sự bồng bột tuổi mới lớn, thiếu kỹ năng kiểm soát cảm xúc, ảnh hưởng từ phim ảnh bạo lực.',
      'Hậu quả nặng nề đối với người bị hại, người gây hại và không khí nhà trường.',
      'Giải pháp: Học cách lắng nghe, thấu hiểu, dám lên tiếng bảo vệ bạn, nhờ thầy cô can thiệp kịp thời.',
      'Thông điệp xây dựng lớp học đoàn kết, thân ái.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Nêu bật tầm quan trọng của phòng chống bạo lực học đường.' },
      { criteria: 'Luận điểm & phân tích', maxPoints: 4.5, description: 'Chỉ rõ nguyên nhân, hậu quả và giải pháp thực tế.' },
      { criteria: 'Tình cảm & thông điệp', maxPoints: 2.5, description: 'Thể hiện thái độ kiên quyết chống bạo lực, giàu lòng nhân ái.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Lời văn chuẩn mực, mạch lạc.' }
    ]
  },
  {
    id: 'NLXH-TU-HOC',
    type: 'social',
    title: 'Tinh thần tự học – Cội nguồn của mọi thành công bền vững',
    topic: 'Ý thức tự học',
    grade: 8,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Chủ tịch Hồ Chí Minh từng dạy: "Học tập là việc phải tiếp tục suốt đời. Không ai có thể tự cho mình là biết đủ rồi". Em hãy viết bài văn nghị luận bàn về vai trò của tinh thần tự học đối với sự tiến bộ của mỗi học sinh.',
    requirements: [
      'Giải thích thế nào là tự học (tự giác tìm tòi, đào sâu suy nghĩ mà không cần ai thúc ép).',
      'Khẳng định vai trò: Tự học giúp ghi nhớ lâu, biến kiến thức của nhân loại thành tài sản của bản thân, rèn luyện tính độc lập.',
      'Dẫn chứng: Tấm gương Bác Hồ tự học ngoại ngữ và các danh nhân tự học thành tài.',
      'Phê phán thói học vẹt, học đối phó, chỉ chờ đợi sự nhồi nhét thụ động.',
      'Phương pháp tự học hiệu quả mà em đang áp dụng.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Làm nổi bật giá trị cốt lõi của việc tự học.' },
      { criteria: 'Luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Lí lẽ chặt chẽ, dẫn chứng Bác Hồ và thực tiễn học đường.' },
      { criteria: 'Liên hệ phương pháp học tập', maxPoints: 2.5, description: 'Chia sẻ kinh nghiệm tự học chân thực, bổ ích.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Hành văn lưu loát, chuẩn ngữ pháp.' }
    ]
  },
  {
    id: 'NLXH-MOI-TRUONG',
    type: 'social',
    title: 'Bảo vệ môi trường xanh – Hành động nhỏ, ý nghĩa lớn',
    topic: 'Bảo vệ môi trường',
    grade: 6,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Trái Đất là ngôi nhà chung của muôn loài, nhưng môi trường đang bị tổn thương nghiêm trọng do rác thải nhựa và ô nhiễm. Hãy viết bài văn nghị luận kêu gọi mọi người cùng chung tay bảo vệ môi trường, bắt đầu từ những hành động nhỏ của học sinh.',
    requirements: [
      'Nêu hiện trạng ô nhiễm môi trường và biến đổi khí hậu quanh ta.',
      'Phân tích nguyên nhân chủ yếu do ý thức con người (xả rác bừa bãi, lạm dụng túi nilon).',
      'Khẳng định: Bảo vệ môi trường chính là bảo vệ cuộc sống và tương lai của chính chúng ta.',
      'Những việc làm cụ thể của học sinh: Phân loại rác, hạn chế đồ nhựa dùng một lần, trồng cây xanh, tiết kiệm điện nước.',
      'Lời kêu gọi tha thiết hướng tới lối sống xanh.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Xác định đúng trách nhiệm bảo vệ môi trường.' },
      { criteria: 'Luận điểm & dẫn chứng', maxPoints: 4.5, description: 'Phân tích thực tế, nêu hành động cụ thể, khả thi.' },
      { criteria: 'Cảm xúc & kêu gọi', maxPoints: 2.5, description: 'Giọng văn sôi nổi, có sức thuyết phục.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Trong sáng, dễ hiểu, phù hợp học sinh lớp 6-7.' }
    ]
  },

  // ===================== B. NGHỊ LUẬN VĂN HỌC =====================
  {
    id: 'NLVH-CHIA-VOI',
    type: 'literary',
    title: 'Tấm lòng nhân hậu và tình yêu sự sống trong "Bầy chim chìa vôi"',
    topic: 'Phân tích nhân vật',
    grade: 7,
    difficulty: 'Cơ bản',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Trong truyện ngắn "Bầy chim chìa vôi" của nhà văn Tạ Duy Anh, hai anh em Mên và Mon đã thức trắng đêm mưa gió vì lo lắng cho bầy chim non ở bãi cát giữa sông. Em hãy viết bài văn phân tích vẻ đẹp tâm hồn nhân hậu, trong sáng và tình yêu thiên nhiên tha thiết của hai đứa trẻ qua chuyến đi giải cứu bầy chim.',
    requirements: [
      'Giới thiệu khái quát tác giả Tạ Duy Anh, tác phẩm "Bầy chim chìa vôi" và hai nhân vật Mên, Mon.',
      'Phân tích diễn biến tâm trạng của hai anh em trong đêm mưa gió (thao thức, lo lắng cho chim mẹ và chim con).',
      'Hành động quả cảm vượt mưa đêm chèo thuyền ra bãi cát cứu chim chìa vôi.',
      'Ý nghĩa khoảnh khắc vỡ òa khi chứng kiến bầy chim chìa vôi non cất cánh bay lên trong ánh bình minh.',
      'Nét đặc sắc nghệ thuật miêu tả tâm lý trẻ thơ chân thực, ngôn ngữ đối thoại hồn nhiên.',
      'Khái quát thông điệp về tình yêu thương muôn loài và sự tôn trọng vẻ đẹp của thế giới tự nhiên.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề nghị luận', maxPoints: 1.5, description: 'Giới thiệu tác giả, tác phẩm và phẩm chất nổi bật của Mên, Mon.' },
      { criteria: 'Phân tích nhân vật & dẫn chứng', maxPoints: 4.5, description: 'Bám sát văn bản, trích dẫn chi tiết đối thoại, hành động đắt giá.' },
      { criteria: 'Đánh giá nghệ thuật & thông điệp', maxPoints: 2.5, description: 'Chỉ rõ nét tài hoa miêu tả tâm lý trẻ em và bài học nhân ái.' },
      { criteria: 'Kỹ năng diễn đạt, lập luận', maxPoints: 1.5, description: 'Bố cục 3 phần hoàn chỉnh, hành văn truyền cảm.' }
    ],
    relatedTextId: 'lop7-baychimchiavoi',
    relatedTextTitle: 'Bầy chim chìa vôi',
    relatedAuthor: 'Tạ Duy Anh',
    quoteOrExcerpt: 'Hai đứa bé đứng lặng trên bờ, nước mắt chảy ròng ròng trên mặt... Chúng nhìn những cánh chim non nớt đang vút lên không trung rực rỡ nắng sớm.'
  },
  {
    id: 'NLVH-DI-LAY-MAT',
    type: 'literary',
    title: 'Bức tranh thiên nhiên rừng U Minh và con người phương Nam trong "Đi lấy mật"',
    topic: 'Phân tích chủ đề tác phẩm',
    grade: 7,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Đọc đoạn trích "Đi lấy mật" (trích tiểu thuyết "Đất rừng phương Nam" của Đoàn Giỏi), người đọc như được đắm mình vào không gian rừng tràm ngút ngàn hương sắc. Em hãy viết bài văn phân tích vẻ đẹp hoang sơ, trù phú của thiên nhiên U Minh và nét đẹp hồn hậu, khoáng đạt của những con người nơi đây (bé An, bé Cò, tía nuôi).',
    requirements: [
      'Giới thiệu nhà văn Đoàn Giỏi, tác phẩm "Đất rừng phương Nam" và đoạn trích "Đi lấy mật".',
      'Phân tích vẻ đẹp thiên nhiên rừng tràm buổi sáng: Ánh nắng, mùi hương hoa tràm ngào ngạt, âm thanh chim chóc ríu rít, bầy ong rừng kỳ thú.',
      'Phân tích vẻ đẹp con người phương Nam: Sự từng trải am hiểu rừng già của người tía nuôi, nét nhanh nhẹn của Cò, tâm hồn tò mò nhạy cảm của bé An.',
      'Nghệ thuật miêu tả cảnh vật bằng nhiều giác quan, ngôn từ đậm đà phong vị Nam Bộ.',
      'Tình cảm gắn bó thiết tha của tác giả dành cho mảnh đất và con người phương Nam.'
    ],
    rubric: [
      { criteria: 'Xác định đúng chủ đề', maxPoints: 1.5, description: 'Nêu rõ vẻ đẹp thiên nhiên trù phú và con người phóng khoáng phương Nam.' },
      { criteria: 'Phân tích cảnh vật và con người', maxPoints: 4.5, description: 'Làm nổi bật nét hoang sơ, sinh động qua các chi tiết giác quan phong phú.' },
      { criteria: 'Nét đặc sắc nghệ thuật & phong cách', maxPoints: 2.5, description: 'Phân tích chất Nam Bộ đặc trưng, cảm xúc yêu mến quê hương đất nước.' },
      { criteria: 'Diễn đạt & ngữ pháp', maxPoints: 1.5, description: 'Văn phong giàu hình ảnh gợi cảm, bố cục cân đối.' }
    ],
    relatedTextId: 'lop7-dilaymat',
    relatedTextTitle: 'Đi lấy mật (Đất rừng phương Nam)',
    relatedAuthor: 'Đoàn Giỏi'
  },
  {
    id: 'NLVH-TRAN-QUOC-TOAN',
    type: 'literary',
    title: 'Khí phách anh hùng của người thiếu niên Hoài Văn Hầu Trần Quốc Toản',
    topic: 'Phân tích nhân vật',
    grade: 8,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Trong đoạn trích truyện lịch sử "Lá cờ thêu sáu chữ vàng" của nhà văn Nguyễn Huy Tưởng, hình tượng người thiếu niên anh hùng Trần Quốc Toản hiện lên với lòng yêu nước nồng nàn và ý chí căm thù giặc sục sôi. Em hãy viết bài văn phân tích nhân vật Hoài Văn Hầu qua cảnh chờ gặp vua tại bến Bình Than và hành động bóp nát quả cam.',
    requirements: [
      'Giới thiệu nhà văn Nguyễn Huy Tưởng và tác phẩm lịch sử xuất sắc "Lá cờ thêu sáu chữ vàng".',
      'Phân tích tâm trạng của Trần Quốc Toản khi đứng trên bờ bến Bình Than: Thao thức, sục sôi căm giận khi nghe tin sứ giặc nghênh ngang, khát khao được vào dự bàn việc nước.',
      'Chi tiết liều mình xuống bến gặp vua: Vừa giữ đạo thần tử (quỳ lạy xin chịu tội) vừa kiên quyết dâng lời tâm huyết "Xin đánh!".',
      'Ý nghĩa biểu tượng của chi tiết bóp nát quả cam lúc nào không biết: Thể hiện nỗi uất ức tột cùng vì bị coi là trẻ con, cùng lòng căm thù giặc và chí khí lớn lao nén chặt trong lồng ngực.',
      'Nghệ thuật xây dựng nhân vật lịch sử sinh động, giàu kịch tính, ngôn ngữ hào hùng.',
      'Bài học về lòng yêu nước và trách nhiệm của tuổi trẻ đối với Tổ quốc.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Nêu bật chí khí anh hùng và lòng yêu nước của Trần Quốc Toản.' },
      { criteria: 'Phân tích chiều sâu nhân vật', maxPoints: 4.5, description: 'Khai thác triệt để chi tiết bóp nát quả cam và lời tâu gan ruột "Xin đánh!".' },
      { criteria: 'Đánh giá nghệ thuật & giá trị giáo dục', maxPoints: 2.5, description: 'Làm sáng tỏ tài năng dựng truyện lịch sử của Nguyễn Huy Tưởng và liên hệ thế hệ trẻ.' },
      { criteria: 'Kỹ năng hành văn', maxPoints: 1.5, description: 'Lời văn hùng hồn, trang nghiêm, giàu cảm xúc tự hào dân tộc.' }
    ],
    relatedTextId: 'lop8-lacotheusauchuvang',
    relatedTextTitle: 'Lá cờ thêu sáu chữ vàng',
    relatedAuthor: 'Nguyễn Huy Tưởng',
    quoteOrExcerpt: 'Hai bàn tay Hoài Văn bóp chặt... Đến lúc mở tay ra, quả cam quý vua ban đã nát tự bao giờ vì nỗi uất hận sục sôi.'
  },
  {
    id: 'NLVH-CA-HUE',
    type: 'literary',
    title: 'Nét đẹp văn hóa tao nhã của ca Huế trên dòng Hương giang',
    topic: 'Cảm nhận về đoạn văn / đặc sắc nghệ thuật',
    grade: 8,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Văn bản "Ca Huế trên sông Hương" của tác giả Hà Ánh Minh đã đưa người đọc đến với một đêm nghe ca Huế lung linh, trầm mặc và đượm tình người. Em hãy viết bài văn cảm nhận nét đẹp độc đáo của di sản ca Huế và tâm hồn gắn bó với cội nguồn văn hóa dân tộc của tác giả.',
    requirements: [
      'Giới thiệu văn bản "Ca Huế trên sông Hương" và nét đặc sắc của văn hóa cố đô Huế.',
      'Không gian và thời gian thưởng thức ca Huế: Đêm trăng trên dòng sông Hương thơ mộng, trôi bồng bềnh trên chiếc thuyền rồng.',
      'Sự phong phú, tinh tế của các làn điệu dân ca Huế và tài nghệ biểu diễn của các ca nhi, nhạc công.',
      'Nét tao nhã, thanh lịch của con người xứ Huế trong từng lời ca, ngón đàn.',
      'Nghệ thuật kết hợp tự sự, miêu tả và biểu cảm giàu chất thơ.',
      'Tình cảm trân trọng di sản văn hóa dân tộc của tác giả và bài học giữ gìn nét đẹp truyền thống.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Nêu rõ vẻ đẹp độc đáo của ca Huế trên sông Hương.' },
      { criteria: 'Cảm nhận không gian & điệu nhạc', maxPoints: 4.5, description: 'Tái hiện sinh động vẻ đẹp thanh tao, trữ tình của đêm ca Huế.' },
      { criteria: 'Đánh giá nghệ thuật & văn hóa', maxPoints: 2.5, description: 'Làm nổi bật giá trị di sản văn hóa và tình yêu quê hương đất nước.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Văn phong nhẹ nhàng, giàu chất nhạc và chất họa.' }
    ],
    relatedTextId: 'lop8-cahuetrensonghuong',
    relatedTextTitle: 'Ca Huế trên sông Hương',
    relatedAuthor: 'Hà Ánh Minh'
  },
  {
    id: 'NLVH-THU-DIEU',
    type: 'literary',
    title: 'Bức tranh mùa thu làng cảnh Việt Nam và nỗi lòng nhà thơ trong "Thu điếu"',
    topic: 'Phân tích thơ',
    grade: 8,
    difficulty: 'Nâng cao',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Bài thơ "Thu điếu" (Câu cá mùa thu) của Nguyễn Khuyến được Xuân Diệu ca ngợi là "điển hình hơn cả cho mùa thu của làng cảnh Việt Nam". Em hãy viết bài văn phân tích bài thơ để làm sáng tỏ vẻ đẹp thanh sơ, tĩnh lặng của cảnh thu và tâm sự u hoài, kín đáo của bậc túc nho yêu nước thương dân.',
    requirements: [
      'Giới thiệu nhà thơ Nguyễn Khuyến – "nhà thơ của làng cảnh Việt Nam" và chùm ba bài thơ thu.',
      'Phân tích bức tranh mùa thu qua các thi liệu quen thuộc của đồng bằng Bắc Bộ: Ao thu lạnh lẽo, thuyền câu bé tẻo teo, sóng biếc gợn tí, lá vàng khẽ đưa vèo, mây lơ lửng, ngõ trúc quanh co...',
      'Nghệ thuật phối màu tinh tế (xanh biếc, vàng hoe, xanh ngắt) và nghệ thuật lấy động tả tĩnh (tiếng cá đớp động dưới chân bèo).',
      'Phân tích tâm thế của người câu cá: Đi câu chỉ là cái cớ để tìm sự tĩnh lặng cho tâm hồn; ẩn sau đó là nỗi niềm trăn trở thời thế, nỗi u hoài của một nhân cách thanh cao trước cảnh nước mất nhà tan.',
      'Đánh giá nét đặc sắc của thể thơ thất ngôn bát cú Đường luật bằng chữ Nôm điêu luyện.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề nghị luận', maxPoints: 1.5, description: 'Khẳng định "Thu điếu" là bức tranh thu điển hình gắn với tâm sự yêu nước thầm kín.' },
      { criteria: 'Phân tích cảnh thu & tình thu', maxPoints: 4.5, description: 'Phân tích chi tiết thi liệu, màu sắc, âm thanh, cái tĩnh và cái động hài hòa.' },
      { criteria: 'Đánh giá nghệ thuật Đường luật Nôm', maxPoints: 2.5, description: 'Làm nổi bật vần "eo" độc đáo, tài gieo vần và tâm sự thế sự sâu sắc.' },
      { criteria: 'Diễn đạt & văn phong', maxPoints: 1.5, description: 'Lời văn trang nhã, giàu sức gợi cảm thụ thi ca.' }
    ],
    relatedTextId: 'lop8-thudieu',
    relatedTextTitle: 'Thu điếu (Câu cá mùa thu)',
    relatedAuthor: 'Nguyễn Khuyến',
    quoteOrExcerpt: 'Ao thu lạnh lẽo nước trong veo,\nMột chiếc thuyền câu bé tẻo teo.\nSóng biếc theo làn hơi gợn tí,\nLá vàng trước gió khẽ đưa vèo.'
  },
  {
    id: 'NLVH-MUA-XUAN-NHO-NHO',
    type: 'literary',
    title: 'Khát vọng dâng hiến cuộc đời trong bài thơ "Mùa xuân nho nhỏ"',
    topic: 'Cảm nhận về đoạn thơ / chủ đề',
    grade: 9,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Trước khi vĩnh biệt cõi đời, trên giường bệnh, nhà thơ Thanh Hải đã gửi gắm tất cả tình yêu cuộc sống và khát vọng sống cao đẹp vào bài thơ "Mùa xuân nho nhỏ". Em hãy viết bài văn phân tích ước nguyện tha thiết muốn làm "một mùa xuân nho nhỏ lặng lẽ dâng cho đời" của thi sĩ trong hai khổ thơ 4 và 5 của bài thơ.',
    requirements: [
      'Giới thiệu nhà thơ Thanh Hải và hoàn cảnh sáng tác vô cùng đặc biệt của bài thơ (tháng 11/1980, khi nhà thơ đang lâm bệnh nặng).',
      'Phân tích ước nguyện hóa thân chân thành: Muốn làm con chim hót, làm một cành hoa, làm một nốt trầm xao xuyến.',
      'Ý nghĩa biểu tượng của "mùa xuân nho nhỏ": Mỗi con người hãy là một mùa xuân tươi đẹp, góp phần làm nên mùa xuân lớn của đất nước.',
      'Thái độ dâng hiến khiêm nhường nhưng bền bỉ: "Lặng lẽ dâng cho đời / Dù là tuổi hai mươi / Dù là khi tóc bạc".',
      'Nghệ thuật thơ năm chữ giàu nhạc điệu, điệp từ, ẩn dụ chuyển đổi cảm giác tinh tế.',
      'Bài học về lẽ sống cống hiến đối với thế hệ trẻ hôm nay.'
    ],
    rubric: [
      { criteria: 'Xác định đúng trọng tâm', maxPoints: 1.5, description: 'Nêu bật khát vọng dâng hiến cao đẹp và khiêm nhường của Thanh Hải.' },
      { criteria: 'Phân tích hình tượng thơ', maxPoints: 4.5, description: 'Khai thác sâu sắc các hình ảnh giản dị mà giàu tính biểu tượng (con chim, cành hoa, nốt trầm).' },
      { criteria: 'Đánh giá nghệ thuật & giá trị nhân sinh', maxPoints: 2.5, description: 'Làm sáng tỏ lẽ sống cống hiến và sự cảm phục trước nhân cách thi sĩ.' },
      { criteria: 'Kỹ năng nghị luận', maxPoints: 1.5, description: 'Mạch văn xúc động, lập luận thuyết phục.' }
    ],
    relatedTextId: 'lop9-muaxuannhonho',
    relatedTextTitle: 'Mùa xuân nho nhỏ',
    relatedAuthor: 'Thanh Hải',
    quoteOrExcerpt: 'Ta làm con chim hót,\nTa làm một cành hoa.\nTa nhập vào hòa ca,\nMột nốt trầm xao xuyến.\n\nMột mùa xuân nho nhỏ,\nLặng lẽ dâng cho đời,\nDù là tuổi hai mươi,\nDù là khi tóc bạc.'
  },
  {
    id: 'NLVH-VIENG-LANG-BAC',
    type: 'literary',
    title: 'Niềm xúc động thiêng liêng và lòng kính yêu Bác trong "Viếng lăng Bác"',
    topic: 'Cảm nhận thơ',
    grade: 9,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Sau ngày đất nước thống nhất, nhà thơ Viễn Phương từ miền Nam ra thăm Thủ đô và vào lăng viếng Bác Hồ. Bao nhiêu cảm xúc dồn nén đã vỡ òa trong những vần thơ bài "Viếng lăng Bác". Em hãy viết bài văn phân tích niềm tôn kính, biết ơn vô hạn và nỗi tiếc thương sâu sắc của nhà thơ khi đứng trước di hài Người.',
    requirements: [
      'Giới thiệu nhà thơ Viễn Phương và hoàn cảnh sáng tác bài thơ năm 1976 khi lăng Bác vừa khánh thành.',
      'Cảm xúc khi đứng bên ngoài lăng: Ấn tượng sâu sắc với hàng tre bát ngát – biểu tượng cho tâm hồn kiên cường của dân tộc Việt Nam.',
      'Cảm xúc khi hòa vào dòng người vào lăng: Hình ảnh ẩn dụ "mặt trời trong lăng rất đỏ" khẳng định sự trường tồn vĩ đại của Bác.',
      'Cảm xúc nghẹn ngào khi đứng trong lăng ngắm Bác yên nghỉ: Giấc ngủ bình yên giữa vầng trăng sáng dịu hiền, nỗi xót xa "nhói ở trong tim".',
      'Ước nguyện khi sắp phải trở về miền Nam: Muốn làm con chim hót, làm đóa hoa tỏa hương, làm cây tre trung hiếu bên lăng Người.',
      'Nghệ thuật thơ trang trọng, thiết tha, ngôn ngữ cô đọng, giàu hình ảnh ẩn dụ.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Nêu rõ tình cảm thành kính, tiếc thương và biết ơn của đồng bào miền Nam với Bác.' },
      { criteria: 'Phân tích hệ thống hình ảnh', maxPoints: 4.5, description: 'Làm nổi bật các ẩn dụ: Hàng tre, mặt trời, vầng trăng, dòng người kết tràng hoa.' },
      { criteria: 'Đánh giá nghệ thuật & ước nguyện', maxPoints: 2.5, description: 'Khắc họa ước nguyện thủy chung, son sắt của người con miền Nam.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Lời văn chân thành, thiêng liêng và xúc động.' }
    ],
    relatedTextId: 'lop9-vienglangbac',
    relatedTextTitle: 'Viếng lăng Bác',
    relatedAuthor: 'Viễn Phương',
    quoteOrExcerpt: 'Bác nằm trong giấc ngủ bình yên,\nGiữa một vầng trăng sáng dịu hiền.\nVẫn biết trời xanh là mãi mãi,\nMà sao nghe nhói ở trong tim!'
  },
  {
    id: 'NLVH-SANG-THU',
    type: 'literary',
    title: 'Những biến chuyển tinh tế của đất trời và lòng người trong "Sang thu"',
    topic: 'Phân tích hình ảnh thơ',
    grade: 9,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Giao mùa là thời khắc thiên nhiên chuyển mình kỳ diệu nhất. Trong bài thơ "Sang thu", Hữu Thỉnh đã đón nhận mùa thu bằng tất cả sự tinh nhạy của giác quan và chiều sâu của tâm hồn từng trải. Em hãy viết bài văn phân tích những nét đặc sắc trong cảm nhận về khoảnh khắc đất trời sang thu qua bài thơ.',
    requirements: [
      'Giới thiệu nhà thơ Hữu Thỉnh và thi phẩm "Sang thu" viết năm 1977.',
      'Tín hiệu thu về bất ngờ, ngỡ ngàng: Hương ổi phả vào gió se, sương chùng chình qua ngõ, cảm giác "Hình như thu đã về".',
      'Bức tranh thiên nhiên sang thu ở tầng không gian rộng lớn: Sông dềnh dàng, chim bắt đầu vội vã, đám mây mùa hạ vắt nửa mình sang thu.',
      'Ý nghĩa hai câu thơ kết bài: "Sấm cũng bớt bất ngờ / Trên hàng cây đứng tuổi" – Vừa tả thực quy luật tự nhiên, vừa là triết lý sâu xa về sự vững vàng của con người sau những biến động, bão giông cuộc đời.',
      'Nghệ thuật nhân hóa, ẩn dụ tinh tế, thể thơ năm chữ nhịp nhàng, ngôn từ giàu chất tạo hình.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Nêu bật cảm nhận tinh tế về bước chuyển mùa từ hạ sang thu.' },
      { criteria: 'Phân tích thi ảnh', maxPoints: 4.5, description: 'Phân tích tài tình hình ảnh "hương ổi", "sương chùng chình", "đám mây vắt nửa mình".' },
      { criteria: 'Khám phá triết lý nhân sinh', maxPoints: 2.5, description: 'Làm sáng tỏ hàm nghĩa hàng cây đứng tuổi và sự trưởng thành của con người.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Ngôn từ trau chuốt, giàu chất thơ.' }
    ],
    relatedTextId: 'lop9-sangthu',
    relatedTextTitle: 'Sang thu',
    relatedAuthor: 'Hữu Thỉnh',
    quoteOrExcerpt: 'Bỗng nhận ra hương ổi\nPhả vào trong gió se\nSương chùng chình qua ngõ\nHình như thu đã về.'
  },
  {
    id: 'NLVH-BEP-LUA',
    type: 'literary',
    title: 'Hình ảnh người bà tần tảo và tình bà cháu ấm áp trong bài thơ "Bếp lửa"',
    topic: 'Phân tích nhân vật / hình ảnh thơ',
    grade: 9,
    difficulty: 'Khá',
    suggestedMinutes: 60,
    maxScore: 10,
    prompt: 'Bằng Việt từng tâm sự: "Bếp lửa là nơi nhóm lên tình yêu thương, nhóm lên niềm tin và sự sống". Em hãy viết bài văn phân tích bài thơ "Bếp lửa" để làm nổi bật hình ảnh người bà tần tảo, giàu đức hy sinh và tình bà cháu thiêng liêng, ấm áp đã nâng cánh ước mơ người cháu khôn lớn thành người.',
    requirements: [
      'Giới thiệu nhà thơ Bằng Việt và hoàn cảnh sáng tác bài thơ khi tác giả đang là sinh viên du học tại Liên Xô (1963).',
      'Hình ảnh bếp lửa khơi nguồn cho dòng hồi tưởng: "Một bếp lửa chờn vờn sương sớm / Một bếp lửa ấp iu nồng đượm".',
      'Hồi ức về những năm tháng tuổi thơ bên bà: Năm đói mòn đói mỏi, tám năm cùng bà nhóm lửa trong tiếng chim tu hú khắc khoải.',
      'Hình ảnh người bà giàu đức hy sinh: Giặc đốt làng vẫn dặn cháu không được kể cho bố mẹ ở chiến khu lo lắng; bà không chỉ nhóm lửa nấu ăn mà còn nhóm lên ngọn lửa của niềm tin, tình yêu thương và sự sống.',
      'Tình cảm biết ơn, nhớ thương da diết của người cháu dù đã đi xa, ngắm muôn vàn ngọn khói nhưng không bao giờ quên bếp lửa của bà.',
      'Sự kết hợp nhuần nhuyễn giữa biểu cảm với miêu tả, tự sự và bình luận.'
    ],
    rubric: [
      { criteria: 'Xác định đúng trọng tâm', maxPoints: 1.5, description: 'Nêu bật vẻ đẹp đức hy sinh của người bà và tình bà cháu sâu nặng.' },
      { criteria: 'Phân tích chi tiết và hình tượng bếp lửa', maxPoints: 4.5, description: 'Phân tích quá trình chuyển biến từ "bếp lửa" tả thực sang "ngọn lửa" biểu tượng.' },
      { criteria: 'Đánh giá nghệ thuật & giá trị nhân văn', maxPoints: 2.5, description: 'Làm sáng tỏ đạo lý cội nguồn, tình cảm gia đình hòa cùng tình yêu quê hương.' },
      { criteria: 'Kỹ năng trình bày', maxPoints: 1.5, description: 'Bố cục rõ ràng, cảm xúc sâu lắng, câu văn mượt mà.' }
    ],
    relatedTextId: 'lop9-beplua',
    relatedTextTitle: 'Bếp lửa',
    relatedAuthor: 'Bằng Việt',
    quoteOrExcerpt: 'Lận đận đời bà biết mấy nắng mưa\nMấy chục năm rồi, đến tận bây giờ\nBà vẫn giữ thói quen dậy sớm\nNhóm bếp lửa ấp iu nồng đượm\nNhóm niềm yêu thương, khoai sắn ngọt bùi...'
  },
  {
    id: 'NLVH-DE-MEN',
    type: 'literary',
    title: 'Bài học đường đời đắt giá của Dế Mèn sau cái chết của Dế Choắt',
    topic: 'Phân tích nhân vật',
    grade: 6,
    difficulty: 'Cơ bản',
    suggestedMinutes: 45,
    maxScore: 10,
    prompt: 'Trong chương mở đầu tác phẩm "Dế Mèn phiêu lưu ký" của nhà văn Tô Hoài, nhân vật Dế Mèn vì thói kiêu căng, xốc nổi đã gây ra cái chết thương tâm cho Dế Choắt. Em hãy viết bài văn phân tích tâm trạng hối hận và bài học đường đời đầu tiên đầy thấm thía mà Dế Mèn đã rút ra bên nấm mồ người bạn xấu số.',
    requirements: [
      'Giới thiệu nhà văn Tô Hoài và tác phẩm nổi tiếng "Dế Mèn phiêu lưu ký".',
      'Phân tích tính cách ban đầu của Dế Mèn: Tự phụ, hung hăng, ỷ mạnh hiếp yếu, trêu chị Cốc.',
      'Diễn biến tâm lý khi gây ra tai họa: Ban đầu hả hê đắc thắng, sau đó sợ hãi trốn vào hang khi thấy Dế Choắt bị mổ oan ức.',
      'Khoảnh khắc Dế Choắt trút hơi thở cuối cùng và lời trăn trối nhân ái: "Ở đời mà có thói hung hăng bậy bạ, có óc mà không biết nghĩ, sớm muộn rồi cũng mang vạ vào mình đấy".',
      'Tâm trạng ân hận tột cùng của Dế Mèn khi đứng lặng trước nấm mồ bạn: Sự thức tỉnh của lương tâm.',
      'Bài học sâu sắc về sự khiêm tốn, lòng trắc ẩn và chịu trách nhiệm về hành vi của bản thân.'
    ],
    rubric: [
      { criteria: 'Xác định vấn đề', maxPoints: 1.5, description: 'Nêu bật sự biến chuyển từ kiêu căng sang thức tỉnh của Dế Mèn.' },
      { criteria: 'Phân tích diễn biến tâm trạng', maxPoints: 4.5, description: 'Bám sát văn bản, làm rõ sự ân hận sâu sắc của nhân vật.' },
      { criteria: 'Đánh giá nghệ thuật & bài học', maxPoints: 2.5, description: 'Nêu bật nghệ thuật miêu tả loài vật sinh động và bài học nhân sinh.' },
      { criteria: 'Diễn đạt', maxPoints: 1.5, description: 'Ngôn từ trong sáng, biểu cảm tốt.' }
    ],
    relatedTextId: 'lop6-baihocduongdoi',
    relatedTextTitle: 'Bài học đường đời đầu tiên (Dế Mèn phiêu lưu ký)',
    relatedAuthor: 'Tô Hoài',
    quoteOrExcerpt: 'Tôi đứng lặng giờ lâu, suy nghĩ về bài học đường đời đầu tiên...'
  }
];
