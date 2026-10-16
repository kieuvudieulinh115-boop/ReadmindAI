import { TextItem, Genre } from '../types';

/**
 * Curated high-resolution illustrative covers for Vietnamese Secondary Literature (THCS) texts.
 * Selected to match the specific artistic atmosphere, nature, characters, and cultural setting
 * according to the Modern Vibrant Educational Dashboard aesthetic.
 */
export const TEXT_COVERS: Record<string, string> = {
  // --- GRADE 6 ---
  'lop6-baihocduongdoi': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=80', // Cỏ xanh nắng mai, giọt sương đồng nội
  'lop6-neucaumuoncomotnguoiban': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80', // Hoàng tử bé và cáo, đồng lúa mì vàng
  'lop6-tiananghatmua': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=700&q=80', // Hạt mưa nắng rực rỡ cầu vồng
  'lop6-nhungnguoiban': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80', // Tình bạn trẻ thơ ấm áp
  'lop6-batnat': 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=700&q=80', // Trẻ thơ nô đùa bình yên
  'lop6-chuyencotichveloainguoi': 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=700&q=80', // Khởi nguyên thế giới, trời xanh mây trắng
  'lop6-mayvasong': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80', // Sóng biển biếc và mây trắng Tagore
  'lop6-buctranhcuaemgaitoi': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80', // Bảng màu vẽ tranh nghệ thuật
  'lop6-nhungcanhbuom': 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=700&q=80', // Cánh buồm trắng ra khơi chân trời
  'lop6-cobandiem': 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=700&q=80', // Ánh lửa diêm sưởi ấm đêm tuyết
  'lop6-giolanhdaumua': 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=700&q=80', // Phố cổ mùa đông, áo ấm yêu thương
  'lop6-conchaomao': 'https://images.unsplash.com/photo-1452570053593-1b910e562308?auto=format&fit=crop&w=700&q=80', // Chim chao mào hót trên cành cây xanh
  'lop6-lackithucsumayman': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80', // Cỏ 4 lá và thiên nhiên xanh mát
  'lop6-chumcadaoquehuong': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80', // Cánh đồng lúa quê hương thanh bình
  'lop6-chuyenconuocminh': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80', // Non nước hữu tình Việt Nam
  'lop6-caytrevietnam': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80', // Lũy tre xanh Việt Nam kiên cường
  'lop6-hanhtrinhcuabayong': 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=700&q=80', // Đàn ong cần mẫn tìm mật hoa
  'lop6-coto': 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=700&q=80', // Đảo Cô Tô, sóng vỗ bờ cát trong xanh
  'lop6-cuulonggiangtaoi': 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=700&q=80', // Dòng Cửu Long giang cuồn cuộn phù sa

  // --- GRADE 7 ---
  'lop7-baychimchiavoi': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=700&q=80', // Bầy chim chìa vôi cất cánh trên bãi sông Đáy
  'lop7-dilaymat': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80', // Rừng tràm U Minh, nắng xuyên tán lá
  'lop7-ngansaolamviec': 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=700&q=80', // Trời đêm ngàn sao lấp lánh trên làng quê
  'lop7-ngoinhatrencay': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80', // Ngôi nhà trên cây giữa rừng xanh
  'lop7-dongdaomuaxuan': 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=700&q=80', // Rừng Trường Sơn mùa xuân hoa nở
  'lop7-gaplacomnep': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80', // Hạt cốm nếp hương thơm vị quê mẹ
  'lop7-trogio': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80', // Gió chướng miền Tây Nam Bộ xao xuyến
  'lop7-chieusongthuong': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=80', // Chiều êm ả trên dòng sông Thương
  'lop7-vuanhammatvuamocuas': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80', // Vườn hoa ngát hương thơm mùa xuân
  'lop7-nguoithaydautien': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80', // Trường làng trên đồi, hai cây phong Đuy-sen
  'lop7-quehuong': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=80', // Làng chài ven biển, thuyền buồm ra khơi
  'lop7-tronglongme': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80', // Tình mẫu tử ngọt ngào trong lòng mẹ
  'lop7-muaxuannhonho': 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=700&q=80', // Mùa xuân nho nhỏ, hoa tím biếc dòng sông xanh
  'lop7-gome': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80', // Xứ Gò Me bình dị miền Tây
  'lop7-baithoduongnui': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80', // Đường núi mù sương, chiều tà khói lam
  'lop7-chieubienngioi': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80', // Biển ngời nắng chiều thanh tĩnh
  'lop7-thanggiengmovetrangnon': 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=700&q=80', // Trăng non đầu xuân Hà Nội, mưa riêu riêu
  'lop7-chuyencomhen': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80', // Cơm hến xứ Huế, cay nồng đậm đà
  'lop7-hoilongtong': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=700&q=80', // Lễ hội Lồng Tồng vùng cao rực rỡ sắc màu
  'lop7-nhungkhuoncuadauyeu': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80', // Những khuôn hình nghệ thuật ấm áp
  'lop7-nhungcanhcotuoitho': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=700&q=80', // Cánh cò bay lả bay la tuổi thơ

  // --- GRADE 8 ---
  'lop8-lacotheusauchuvang': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80', // Đoàn thuyền rồng bến Bình Than, cờ Trần Quốc Toản
  'lop8-cahuetrensonghuong': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80', // Thuyền rồng trên sông Hương trăng soi bóng
  'lop8-quadeongang': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80', // Đèo Ngang mây mờ, cỏ cây chen đá lá chen hoa
  'lop8-hichtuongsi': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80', // Hào khí Đông A, Trần Hưng Đạo
  'lop8-tinhthanyeunuoc': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80', // Lòng nồng nàn yêu nước của nhân dân ta
  'lop8-namquocsonha': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80', // Non sông gấm vóc trời Nam
  'lop8-chieudoido': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=700&q=80', // Rồng bay đất Thăng Long ngàn năm
  'lop8-lexuongdanh': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80', // Trường thi khoa cử ngày xưa
  'lop8-laitan': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80', // Thơ trào phúng Nhật kí trong tù
  'lop8-giongdieucuatiengcuoi': 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=700&q=80', // Tiếng cười châm biếm, sân khấu kịch
  'lop8-vinhcayvong': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=80', // Cây vông trào phúng dân gian
  'lop8-truonggiahoclamsang': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=700&q=80', // Hài kịch Molie, áo hoa quý tộc
  'lop8-chumtruyencuoidangian': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=700&q=80', // Truyện cười dân gian hóm hỉnh
  'lop8-chumcadaotraophung': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=700&q=80', // Ca dao trào phúng sâu cay
  'lop8-giakhongcoruoi': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=80', // Khoa học vi sinh và đời sống

  // --- GRADE 9 ---
  'lop9-chuyennguoicongai': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80', // Sương mờ bến Hoàng Giang, Vũ Nương
  'lop9-dechoi': 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=80', // Chú dế thần kì, Liêu Trai chí dị
  'lop9-sontinhthuytinh': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80', // Núi Tản Viên sừng sững đối đầu sóng lũ
  'lop9-ngocnuvetaychanchu': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80', // Truyện kì ảo duyên phận
  'lop9-noiniemchinhphu': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=80', // Trăng khuya ngóng đợi người chinh phu
  'lop9-tiengdanmua': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=700&q=80', // Mưa rơi thềm vắng, giọt đàn mưa ngân
  'lop9-motthethodocdao': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=700&q=80', // Thơ lục bát và song thất lục bát cổ truyền
  'lop9-kimkieugapgo': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80', // Cỏ non xanh tận chân trời, cành lê trắng điểm
  'lop9-lucvantien': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80', // Lục Vân Tiên cứu Kiều Nguyệt Nga
  'lop9-tutinh2': 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=700&q=80', // Đêm trăng Hồ Xuân Hương, vầng trăng xế
  'lop9-nguoicongainamxuongbikich': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80', // Bình luận văn học sâu sắc
  'lop9-tuthangquynho': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80', // Tuổi thơ Nguyễn Nhật Ánh
  'lop9-ngayxua': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80', // Kí ức ngày xưa hoài niệm
  'lop9-romeovagiuliet': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80', // Đêm trăng tình yêu Romeo và Juliet
  'lop9-loxithoiii': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=700&q=80', // Kịch cổ điển châu Âu hào hiệp
  'lop9-laohac': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80' // Mảnh vườn nghèo và tấm lòng nhân hậu của Lão Hạc
};

/**
 * Fallback curated covers by genre to ensure every single text has a stunning,
 * contextually relevant visual cover.
 */
export const GENRE_FALLBACK_COVERS: Record<Genre, string> = {
  'truyen': 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80', // Sách truyện cổ tích
  'tho': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=700&q=80', // Hoa lá mùa xuân thơ ca
  'nghi-luan': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=700&q=80', // Bút lông và trang sách cổ
  'thong-tin': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=700&q=80', // Nhật báo tư liệu kí sự
  'ngu-ngon': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=700&q=80', // Thiên nhiên kì thú ngụ ngôn
  'khoa-hoc': 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=700&q=80', // Khám phá vũ trụ khoa học
  'doi-song-moi-truong': 'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=700&q=80' // Môi trường sinh thái xanh tươi
};

/**
 * Returns a high quality cover image URL for any text.
 */
export function getCoverImage(text: TextItem): string {
  if (text.coverImage && text.coverImage.trim().length > 0) {
    return text.coverImage;
  }
  if (text.id && TEXT_COVERS[text.id]) {
    return TEXT_COVERS[text.id];
  }
  return GENRE_FALLBACK_COVERS[text.genre] || GENRE_FALLBACK_COVERS['truyen'];
}
