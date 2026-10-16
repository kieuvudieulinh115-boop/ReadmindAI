import { TextItem, PoemAnalysis, StanzaAnalysis } from '../types';

/**
 * Curated literature curriculum analysis for poems in Secondary Literature (GDPT 2018)
 */
export const POETRY_DATABASE: Record<string, Partial<PoemAnalysis>> = {
  // LỚP 6
  'lop6-tiananghatmua': {
    poeticForm: 'Thơ năm chữ (Ngũ ngôn)',
    sourceOrigin: 'SGK Ngữ văn 6, Tập một - Bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam)',
    centralTheme: 'Tình bạn tuổi học trò trong sáng, hồn nhiên và gắn kết vô tư.',
    mainMessage: 'Tình bạn là món quà quý giá của tuổi thơ; hãy trân trọng, nâng niu từng kỷ niệm và luôn thấu hiểu, yêu thương bạn bè.',
    tone: 'Tươi vui, dí dỏm, hồn nhiên và ấm áp.',
    stanzas: [
      {
        stanzaIndex: 1,
        lines: [
          'Hình như trong từng tia nắng',
          'Có nét tinh nghịch bạn trai',
          'Hình như trong từng tia nắng',
          'Biết chiều tiếng ve ngân dài'
        ],
        summary: 'Hình ảnh tia nắng mùa hè gắn với nét tinh nghịch, sôi nổi của các bạn nam.',
        rhythm: '2/3 hoặc 3/2 nhịp nhàng',
        rhetoricDevices: ['Điệp ngữ "Hình như trong từng tia nắng"', 'Nhân hóa tia nắng "tinh nghịch", "biết chiều"'],
        poeticImages: ['Tia nắng vàng hè', 'Tiếng ve ngân dài'],
        emotionsTone: 'Hồn nhiên, rộn ràng mùa hạ'
      },
      {
        stanzaIndex: 2,
        lines: [
          'Hình như trong từng hạt mưa',
          'Có nụ cười duyên bạn gái',
          'Hình như trong từng hạt mưa',
          'Có dòng lưu bút đọng lại'
        ],
        summary: 'Hình ảnh hạt mưa rào dịu mát gắn với nụ cười duyên dáng của bạn nữ và trang lưu bút kỷ niệm.',
        rhythm: '2/3 ngắt nhịp lắng đọng',
        rhetoricDevices: ['Điệp cấu trúc câu "Hình như trong từng hạt mưa"', 'Ẩn dụ chuyển đổi cảm giác hạt mưa - nụ cười duyên'],
        poeticImages: ['Hạt mưa rào trong trẻo', 'Dòng lưu bút tuổi học trò'],
        emotionsTone: 'Dịu dàng, e ấp, tha thiết'
      },
      {
        stanzaIndex: 3,
        lines: [
          'Tia nắng hạt mưa trẻ mãi',
          'Màu hoa phượng đỏ vô tư',
          'Bạn ơi, đừng trách vô cớ',
          'Làm buồn tia nắng hạt mưa.'
        ],
        summary: 'Lời nhắn nhủ giữ gìn tình bạn trong sáng, đừng để những hờn giận vu vơ làm phai nhòa vẻ đẹp tuổi học trò.',
        rhythm: '2/3 thiết tha',
        rhetoricDevices: ['Ẩn dụ "Tia nắng hạt mưa trẻ mãi"', 'Lời gọi tha thiết "Bạn ơi..."'],
        poeticImages: ['Màu hoa phượng đỏ vô tư', 'Tia nắng hạt mưa'],
        emotionsTone: 'Chân thành, nhắc nhở yêu thương'
      }
    ]
  },

  'lop6-chuyenco': {
    poeticForm: 'Thơ lục bát',
    sourceOrigin: 'Trích tập thơ "Bài thơ vẽ chim" - Lâm Thị Mỹ Dạ (SGK Ngữ văn 6, Kết nối tri thức)',
    centralTheme: 'Tình yêu quê hương nguồn cội và niềm tự hào về kho tàng truyện cổ dân gian Việt Nam.',
    mainMessage: 'Truyện cổ dân gian là dòng sữa tinh thần nuôi dưỡng tâm hồn con người Việt Nam: dạy bài học nhân hậu, bao dung, ở hiền gặp lành.',
    tone: 'Trầm lắng, ân tình, tha thiết và tự hào.',
    stanzas: [
      {
        stanzaIndex: 1,
        lines: [
          'Tôi yêu truyện cổ nước tôi',
          'Vừa nhân hậu lại tuyệt vời sâu xa',
          'Thương người rồi mới thương ta',
          'Yêu nhau dù mấy cách xa cũng tìm'
        ],
        summary: 'Bày tỏ tình yêu trực tiếp với truyện cổ và bài học nhân ái "thương người như thể thương thân".',
        rhythm: '2/2/2 (câu 6) và 4/4 (câu 8)',
        rhetoricDevices: ['Điệp từ "thương", "yêu"', 'Thành ngữ dân gian "Thương người rồi mới thương ta"'],
        poeticImages: ['Truyện cổ nước mình', 'Tấm lòng nhân hậu'],
        emotionsTone: 'Chân thành, sâu lắng'
      }
    ]
  },

  'lop6-mayvasong': {
    poeticForm: 'Thơ tự do',
    sourceOrigin: 'R. Ta-go (Trích tập thơ Trăng non - Ấn Độ)',
    centralTheme: 'Tình mẫu tử thiêng liêng, bất diệt và thế giới tưởng tượng diệu kỳ của tuổi thơ.',
    mainMessage: 'Hạnh phúc đích thực không nằm ở những chân trời xa xôi ngoài vũ trụ, mà nằm ngay trong vòng tay yêu thương ấm áp của mẹ.',
    tone: 'Trong trẻo, bay bổng, ấm áp và ngập tràn tình yêu thương.'
  },

  'lop6-batnat': {
    poeticForm: 'Thơ năm chữ',
    sourceOrigin: 'Nguyễn Thế Hoàng Linh (Trích tập Ra vườn nhặt nắng)',
    centralTheme: 'Phê phán thói bắt nạt trong trường học và cổ vũ lối sống nhân ái, hòa đồng.',
    mainMessage: 'Bắt nạt là hành vi xấu xí cần loại bỏ; hãy dành sức lực để yêu thương, học tập và sẻ chia niềm vui với mọi người.',
    tone: 'Hóm hỉnh, nhẹ nhàng, dứt khoát và thuyết phục.'
  },

  // LỚP 7
  'lop7-dongda': {
    poeticForm: 'Thơ bốn chữ',
    sourceOrigin: 'Nguyễn Khoa Điềm (SGK Ngữ văn 7 - Bộ Kết nối tri thức với cuộc sống)',
    centralTheme: 'Hình tượng người lính trẻ hi sinh anh dũng giữa rừng Trường Sơn thời chống Mỹ.',
    mainMessage: 'Sự hi sinh của những người lính đã hóa thân vào mùa xuân đất nước, mãi mãi sống trong lòng nhân dân.',
    tone: 'Thành kính, xót xa mà tự hào, âm vang nhịp điệu đồng dao.'
  },

  'lop7-tiengga': {
    poeticForm: 'Thơ năm chữ',
    sourceOrigin: 'Xuân Quỳnh (In trong tập Hoa dọc chiến hào)',
    centralTheme: 'Tiếng gà trưa trên đường hành quân đánh thức những kỷ niệm ấm áp về người bà tần tảo.',
    mainMessage: 'Tình bà cháu sâu nặng là điểm tựa tinh thần vững chắc, tiếp thêm sức mạnh cho người lính bảo vệ Tổ quốc.',
    tone: 'Bồi hồi, da diết, ấm áp yêu thương.'
  },

  'lop7-gaplacomnep': {
    poeticForm: 'Thơ năm chữ',
    sourceOrigin: 'Thanh Thảo (SGK Ngữ văn 7 - Bộ Kết nối tri thức)',
    centralTheme: 'Hương nếp thơm khơi gợi nỗi nhớ mẹ nghèo và tình yêu Tổ quốc bao la.',
    mainMessage: 'Tình yêu mẹ hòa quyện sâu sắc với tình yêu đất nước trong trái tim người lính trẻ.',
    tone: 'Lắng đọng, xúc động và thiêng liêng.'
  },

  // LỚP 8
  'lop8-nhonam': {
    poeticForm: 'Thơ tám chữ',
    sourceOrigin: 'Thế Lữ (In trong tập Mấy vần thơ - Tiêu biểu cho Phong trào Thơ mới)',
    centralTheme: 'Nỗi uất hận của con hổ trong vườn bách thú và khát vọng tự do cháy bỏng.',
    mainMessage: 'Mượn lời con hổ để kín đáo thể hiện tâm sự yêu nước thầm kín và khát khao giải phóng của người dân mất nước lúc bấy giờ.',
    tone: 'Hào hùng, bi tráng, u uất và mãnh liệt.'
  },

  'lop8-quehuong': {
    poeticForm: 'Thơ tám chữ',
    sourceOrigin: 'Tế Hanh (In trong tập Nghẹn ngào)',
    centralTheme: 'Bức tranh tươi sáng, khỏe khoắn về một làng chài ven biển và tình yêu quê hương nồng nàn.',
    mainMessage: 'Quê hương luôn là bến đỗ bình yên, là vẻ đẹp khỏe khoắn ngập tràn sức sống trong tâm khảm mỗi người con xa xứ.',
    tone: 'Trong sáng, bay bổng, thiết tha và dạt dào cảm xúc.'
  },

  'lop8-ongdo': {
    poeticForm: 'Thơ năm chữ',
    sourceOrigin: 'Vũ Đình Liên (SGK Ngữ văn 8 - Kết nối tri thức)',
    centralTheme: 'Hình ảnh ông đồ thời tàn và nỗi niềm thương tiếc cho một nét đẹp văn hóa truyền thống bị lãng quên.',
    mainMessage: 'Lời nhắc nhở về đạo lý uống nước nhớ nguồn, trân trọng các giá trị văn hóa cổ truyền của dân tộc.',
    tone: 'Trầm buồn, xót xa, hoài niệm và ngậm ngùi.'
  },

  // LỚP 9
  'lop9-dongchi': {
    poeticForm: 'Thơ tự do',
    sourceOrigin: 'Chính Hữu (In trong tập Đầu súng trăng treo - 1948)',
    centralTheme: 'Tình đồng chí keo sơn gắn bó của những người lính nông dân trong kháng chiến chống Pháp.',
    mainMessage: 'Tình đồng chí bắt nguồn từ cùng cảnh ngộ, cùng lý tưởng và được tôi luyện trong gian khổ, hiểm nguy.',
    tone: 'Mộc mạc, chân thành, cô đọng và trang nghiêm.'
  },

  'lop9-beplua': {
    poeticForm: 'Thơ tám chữ kết hợp bảy chữ',
    sourceOrigin: 'Bằng Việt (Sáng tác năm 1963 khi đang du học tại Liên Xô)',
    centralTheme: 'Hình tượng ngọn bếp lửa gắn liền với hình ảnh người bà tần tảo, giàu tình yêu thương.',
    mainMessage: 'Bếp lửa là biểu tượng của tình bà cháu thiêng liêng, của hơi ấm gia đình và cội nguồn quê hương nuôi dưỡng tâm hồn.',
    tone: 'Bồi hồi, tha thiết, xúc động và lắng sâu.'
  },

  'lop9-anhthang': {
    poeticForm: 'Thơ năm chữ',
    sourceOrigin: 'Nguyễn Duy (Sáng tác năm 1978 tại TP. Hồ Chí Minh)',
    centralTheme: 'Vầng trăng tri kỷ và lời nhắc nhở về lối sống thủy chung, nghĩa tình sau chiến tranh.',
    mainMessage: 'Lời cảnh tỉnh con người không được lãng quên quá khứ gian khổ, phải giữ gìn đạo lý "Uống nước nhớ nguồn".',
    tone: 'Tự sự, triết lý, chân thành và sâu sắc.'
  },

  'lop9-muaxuannhonho': {
    poeticForm: 'Thơ năm chữ',
    sourceOrigin: 'Thanh Hải (Sáng tác tháng 11/1980, không lâu trước khi nhà thơ qua đời)',
    centralTheme: 'Bức tranh mùa xuân thiên nhiên, đất nước và khát vọng cống hiến cho đời.',
    mainMessage: 'Mỗi người hãy là một "mùa xuân nho nhỏ" để lặng lẽ dâng hiến cho mùa xuân lớn của non sông đất nước.',
    tone: 'Tha thiết, say mê, trong sáng và trang trọng.'
  },

  'lop9-sangthu': {
    poeticForm: 'Thơ năm chữ',
    sourceOrigin: 'Hữu Thỉnh (In trong tập Từ chiến hào đến thành phố - 1977)',
    centralTheme: 'Cảm nhận tinh tế về khoảnh khắc giao mùa từ hạ sang thu của đất trời.',
    mainMessage: 'Thiên nhiên lúc sang thu chứa đựng những chiêm nghiệm sâu sắc về con người và cuộc đời khi đã từng trải.',
    tone: 'Nhẹ nhàng, êm dịu, bâng khuâng và sâu lắng.'
  },

  'lop9-vienglangbac': {
    poeticForm: 'Thơ tám chữ',
    sourceOrigin: 'Viễn Phương (Sáng tác tháng 4/1976 khi lăng Chủ tịch Hồ Chí Minh vừa khánh thành)',
    centralTheme: 'Tấm lòng thành kính, biết ơn và tiếc thương vô hạn của đồng bào miền Nam đối với Bác Hồ.',
    mainMessage: 'Bác Hồ sống mãi trong sự nghiệp và trái tim của dân tộc Việt Nam.',
    tone: 'Trang nghiêm, thành kính, nghẹn ngào và xúc động.'
  }
};

/**
 * Helper to inspect line syllables and deduce poetic form
 */
export function detectPoeticForm(lines: string[]): string {
  const cleanLines = lines.map(l => l.trim()).filter(l => l.length > 0);
  if (cleanLines.length === 0) return 'Thơ tự do';

  const counts = cleanLines.map(l => l.split(/\s+/).length);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  const isAll4 = counts.every(c => c === 4);
  const isAll5 = counts.every(c => c === 5);
  const isAll7 = counts.every(c => c === 7);
  const isAll8 = counts.every(c => c === 8);

  // Check lục bát (pairs of 6 and 8)
  let isLucBat = false;
  if (cleanLines.length >= 2 && counts[0] === 6 && counts[1] === 8) {
    isLucBat = true;
  }

  if (isLucBat) return 'Thơ lục bát';
  if (isAll4 || (avg >= 3.8 && avg <= 4.2)) return 'Thơ bốn chữ';
  if (isAll5 || (avg >= 4.8 && avg <= 5.2)) return 'Thơ năm chữ';
  if (isAll7 || (avg >= 6.8 && avg <= 7.2)) return 'Thơ bảy chữ';
  if (isAll8 || (avg >= 7.8 && avg <= 8.2)) return 'Thơ tám chữ';
  return 'Thơ tự do';
}

/**
 * Intelligent helper to extract stanzas and analyses for any poem
 */
export function getPoemAnalysis(text: TextItem): PoemAnalysis {
  const base = POETRY_DATABASE[text.id] || {};
  const allLines = text.content.split('\n');

  // Break into stanzas by empty lines
  const rawStanzas: string[][] = [];
  let currentStanza: string[] = [];

  for (const line of allLines) {
    if (line.trim().length === 0) {
      if (currentStanza.length > 0) {
        rawStanzas.push(currentStanza);
        currentStanza = [];
      }
    } else {
      currentStanza.push(line.trim());
    }
  }
  if (currentStanza.length > 0) {
    rawStanzas.push(currentStanza);
  }

  const poeticForm = text.poeticForm || base.poeticForm || detectPoeticForm(allLines);
  const sourceOrigin = base.sourceOrigin || `${text.bookCollection} - ${text.unit} (Bộ Giáo dục & Đào tạo)`;
  const centralTheme = base.centralTheme || `Cảm thụ và ngợi ca vẻ đẹp qua tác phẩm "${text.title}" của ${text.authorOrSource}.`;
  const mainMessage = base.mainMessage || `Bồi đắp tình cảm nhân văn, lòng yêu thương và nhận thức sâu sắc về cuộc sống qua ngôn ngữ thơ ca.`;
  const tone = base.tone || 'Truyền cảm, sâu lắng, đậm chất thơ ca';

  // Build stanza analyses if not predefined
  let stanzas: StanzaAnalysis[] = base.stanzas || [];
  if (stanzas.length === 0) {
    stanzas = rawStanzas.map((lines, idx) => {
      // Find sample rhythm from text.poetryRhythms if available
      const sampleRhythm = text.poetryRhythms?.[idx]?.rhythm || (poeticForm.includes('năm') ? '2/3 hoặc 3/2' : poeticForm.includes('bốn') ? '2/2' : poeticForm.includes('lục bát') ? '2/2/2 - 4/4' : 'Linh hoạt theo cảm xúc');
      const sampleEmotion = text.poetryRhythms?.[idx]?.emotion || 'Bồi hồi, thiết tha';

      return {
        stanzaIndex: idx + 1,
        lines,
        summary: `Khổ thơ thứ ${idx + 1}: Diễn tả hình ảnh giàu sức biểu cảm và tâm tư của tác giả (${lines.length} câu thơ).`,
        rhythm: sampleRhythm,
        rhetoricDevices: ['Biện pháp điệp từ, điệp cấu trúc', 'Hình ảnh ẩn dụ giàu sức gợi'],
        poeticImages: lines.slice(0, 2),
        emotionsTone: sampleEmotion
      };
    });
  }

  return {
    poeticForm,
    sourceOrigin,
    centralTheme,
    mainMessage,
    tone,
    stanzas
  };
}
