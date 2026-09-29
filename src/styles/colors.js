/**
 * 색상 팔레트 단일 소스.
 * tailwind.config.js(Tailwind 색상 토큰)와 런타임 JS(동적 색상 계산)에서 함께 사용한다.
 */
const colors = {
  black: "#000000",
  darkBg1: "#191B20",
  darkBg2: "#0C0D0F",
  rankBg1: "#2C2F38",
  rankBg2: "#22252B",
  rankBg3: "#141619",
  border1: "#363B41",
  border2: "#343842",
  cardBorder: "#22252B", // 카드/행 테두리(스코어보드·랭크 행)
  primary1: "#D1DBE8",
  primary2: "#9AA0A8", // 보조 텍스트(대비 상향, 앱 전역)
  primary3: "#6B7078", // 최하위 미세 라벨(열 제목, 챔피언 서브명, 캡션)
  red: "#351314",
  redPopular: "#F2789F", // "인기" 배지 로즈
  redLighten: "#664446",
  redDarken: "#1A1010",
  redHover: "#2e0606",
  redText: "#FF6B8B",
  redButton: "#723335",
  blue: "#0B2344",
  blueLighten: "#1B2635",
  blueDarken: "#0C141F",
  blueText: "#6BB8FF",
  blueText2: "#6A89AF",
  blueHover: "#081A33",
  blueButton: "#355A8D",
  white: "#FFFFFF",
  gray: "#9A9A9A",
  grayHover: "#212121",
  yellow: "#FFC364",
  neonGreen: "#71FF97",
  tierBlue: "#2457FF",
  tierBrown: "#C94F77", // Tier-5 배지 로즈
  // 팀 강조색 (스코어보드/바)
  teamWin: "#58A6FF",
  teamLoss: "#F2789F",
  winRowBg: "#0E1A2B", // 승리 팀 헤더 틴트 배경
  loseRowBg: "#241019", // 패배 팀 헤더/행 틴트 배경
  primaryLaneBg: "#111826", // 주 포지션 하이라이트 배경
  primaryLaneBorder: "#23324A",
  // 주요 액션 버튼(단일 primary)
  bluePrimary: "#3B82F6",
  // 데미지 게이지
  damageAmberFrom: "#E8913C",
  damageAmberTo: "#F5C877",
  damageSlate: "#6B74A0",
  // about·faq·guide 전용. 앱 본문보다 밝은 톤이라 기존 토큰과 섞지 않는다.
  landing: {
    // 배경 — bg와 bgSection의 미세한 차이는 섹션을 구분하는 장치라 합치지 않는다.
    bg: "#0A0B0D",
    bgSection: "#0C0D10",
    bgCard: "#121418",
    bgElevated: "#15171B",
    bgOverlay: "#050608",
    gradBottom: "#101216",
    gradBottomAlt: "#0D0F13",
    // 텍스트
    heading: "#F1F5FA",
    headingSm: "#E8EDF3",
    body: "#C4CBD4",
    bodySecondary: "#9BA3AD",
    bodyOnTint: "#A9B2BD", // 틴트 배경 콜아웃 안의 본문 — 배경이 있어 한 단계 밝다
    caption: "#8A929C",
    micro: "#6C727A",
    microFaint: "#5E656E", // CTA 아래로 물러나는 보조 문구
    // 강조
    gold: "#C8AA6E",
    goldLight: "#E8D6A8",
    goldMuted: "#D9BE85",
    periwinkle: "#8AA0FF",
    periwinkleHover: "#B0BEFF",
    discord: "#5865F2",
    discordHover: "#4954DA",
    glowBlue: "#2B6FDB",
    dotRed: "#FF5F57",
    dotAmber: "#FEBC2E",
    dotGreen: "#28C840",
  },
  // 기타
  slotEmpty: "#1C1F24", // 빈 아이템 슬롯 / 바 트랙
  levelBadgeBg: "#0A0B0D",
};

module.exports = colors;
