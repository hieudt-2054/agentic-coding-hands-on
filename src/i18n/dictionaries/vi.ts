const vi = {
  // Common — nav, footer, shared
  'common.nav.aboutSaa': 'About SAA 2025',
  'common.nav.awards': 'Awards Information',
  'common.nav.kudos': 'Sun* Kudos',
  'common.nav.menu': 'Menu',
  'common.nav.notifications': 'Thông báo',
  'common.nav.account': 'Tài khoản của bạn',
  'common.copyright': 'Bản quyền thuộc về Sun* © 2025',
  'common.detail': 'Chi tiết',
  'common.detailArrow': 'Chi tiết →',
  'common.comingSoon': 'Coming soon',

  // Homepage
  'home.countdown.days': 'DAYS',
  'home.countdown.hours': 'HOURS',
  'home.countdown.minutes': 'MINUTES',
  'home.eventInfo.time': 'Thời gian:',
  'home.eventInfo.venue': 'Địa điểm:',
  'home.cta.aboutAwards': 'ABOUT AWARDS',
  'home.cta.aboutKudos': 'ABOUT KUDOS',
  'home.awards.caption': 'Sun* annual awards 2025',
  'home.awards.title': 'Hệ thống giải thưởng',
  'home.kudos.label': 'Phong trào ghi nhận',

  // Prelaunch
  'prelaunch.heading': 'Sự kiện sẽ bắt đầu sau',
  'prelaunch.comingSoon': 'Coming soon',

  // Awards page
  'awards.title': 'Hệ thống giải thưởng SAA 2025',
  'awards.caption': 'Sun* annual awards 2025',
  'awards.quantity': 'Số lượng giải thưởng:',
  'awards.prizeValue': 'Giá trị giải thưởng:',
  'awards.sidebar.label': 'Danh mục giải thưởng',
  'awards.empty': 'Chưa có dữ liệu giải thưởng',

  // Login
  'login.hero': 'Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!',
  'login.button': 'LOGIN With Google',
  'login.error': 'Xác thực thất bại. Vui lòng thử lại.',
  'login.loading': 'Đang tải',

  // Kudos - Live Board
  'kudos.hero.slogan': 'Hệ thống ghi nhận và cảm ơn',
  'kudos.hero.composePlaceholder': 'Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?',
  'kudos.hero.searchSunner': 'Tìm kiếm sunner',
  'kudos.filter.hashtag': 'Hashtag',
  'kudos.filter.department': 'Phòng ban',
  'kudos.filter.stale': 'Bộ lọc đã được cập nhật',
  'kudos.section.event': 'Sun* Annual Awards 2025',
  'kudos.section.highlight': 'HIGHLIGHT KUDOS',
  'kudos.section.spotlight': 'SPOTLIGHT BOARD',
  'kudos.section.all': 'ALL KUDOS',
  'kudos.empty': 'Hiện tại chưa có Kudos nào.',
  'kudos.card.viewDetail': 'Xem chi tiết',
  'kudos.card.copyLink': 'Copy Link',
  'kudos.card.copied': 'Link copied — ready to share!',
  'kudos.card.copyFailed': 'Không thể sao chép liên kết',
  'kudos.heart.selfDisabled': 'Bạn không thể thả tim cho kudos của mình',
  'kudos.heart.error': 'Không thể lưu lượt thả tim, vui lòng thử lại',
  'kudos.heart.rateLimited': 'Bạn đã vote quá nhanh, thử lại sau',
  'kudos.stats.received': 'Số Kudos bạn nhận được:',
  'kudos.stats.sent': 'Số Kudos bạn đã gửi:',
  'kudos.stats.hearts': 'Số tim bạn nhận được:',
  'kudos.stats.boxOpened': 'Số Secret Box bạn đã mở:',
  'kudos.stats.boxUnopened': 'Số Secret Box chưa mở:',
  'kudos.stats.openGift': 'Mở quà',
  'kudos.stats.noGifts': 'Bạn chưa có hộp quà nào',
  'kudos.topRecipients.title': '10 SUNNER NHẬN QUÀ MỚI NHẤT',
  'kudos.topRecipients.empty': 'Chưa có dữ liệu',
  'kudos.spotlight.counterSuffix': 'KUDOS',
  'kudos.spotlight.search': 'Tìm kiếm',
  'kudos.spotlight.liveTicker': '{time} {name} đã nhận được một Kudos mới',
  'kudos.hoaThi.1': 'Sunner đã nhận được 10 Kudos và bắt đầu lan tỏa năng lượng ấm áp đến mọi người xung quanh.',
  'kudos.hoaThi.2': 'Sunner đã nhận được 20 Kudos và chứng minh sức ảnh hưởng của mình qua những hành động lan tỏa tích cực mỗi ngày.',
  'kudos.hoaThi.3': 'Sunner đã nhận được 50 Kudos và trở thành hình mẫu của sự công nhận, sẻ chia và lan tỏa tinh thần Sun*.',
  'kudos.image.ariaLabel': 'Xem ảnh {i}/{total}',
  'kudos.stub.comingSoon': 'Tính năng này đang được phát triển.',
} as const;

export type DictionaryKey = keyof typeof vi;
export type Dictionary = Record<DictionaryKey, string>;
export default vi as Dictionary;
