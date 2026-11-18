import { setDemoMode } from "@/demo/demoMode";

/**
 * 데모 모드는 sessionStorage에 남아 OAuth 리다이렉트 뒤에도 유지되므로, 끄지 않으면
 * 로그인하고 돌아와도 /api/auth/me를 데모 어댑터가 받아 비로그인으로 보인다.
 */
const startDiscordLogin = () => {
  setDemoMode(false);
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;
};

export default startDiscordLogin;
