module.exports = {
  experimental: {
    optimizeCss: true, // Tailwind CSS 최적화
  },
  images: {
    domains: ["ddragon.leagueoflegends.com", "cdn.discordapp.com"], // 외부 이미지 도메인
  },
  async redirects() {
    // 클랜 관리 진입 시 기본 메뉴(업로드 권한 관리)로 이동. 모든 클랜 메뉴 경로 뎁스 통일.
    return [{ source: "/clan", destination: "/clan/upload", permanent: false }];
  },
};
