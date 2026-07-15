export interface ClanMenu {
  label: string;
  href: string;
}

// 클랜 관리 사이드바 "구성원" 메뉴
export const CLAN_MENUS: ClanMenu[] = [
  { label: "멤버 업로드 권한 관리", href: "/clan" },
  { label: "클랜원 상태 관리", href: "/clan/status" },
  { label: "부계정 연결 관리", href: "/clan/sub-accounts" },
];
