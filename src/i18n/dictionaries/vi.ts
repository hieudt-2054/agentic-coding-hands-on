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
} as const;

export type DictionaryKey = keyof typeof vi;
export type Dictionary = Record<DictionaryKey, string>;
export default vi as Dictionary;
