/**
 * 지난 방문에 로그인 상태였는지 기억하는 localStorage 키.
 * `/`는 미리 렌더된 소개 화면 HTML로 먼저 그려지므로, 로그인 사용자에게 소개 화면이
 * 잠깐 비치지 않도록 _document의 인라인 스크립트가 이 값으로 html에 표시를 남긴다.
 */
export const AUTH_HINT_KEY = "gmok:wasLoggedIn";

/** 표시가 남아 있는 동안 `.landing-gate`를 숨긴다(global.css). */
export const AUTH_HINT_ATTR = "data-auth-hint";

/** 한 번이라도 로그인한 적 있는 브라우저. 세션이 끊겨도 지우지 않고 로그인 안내 말풍선에 쓴다. */
export const RETURNING_USER_KEY = "gmok:hasLoggedIn";

/** 말풍선을 닫으면 이번 탭에서는 다시 띄우지 않는다. */
export const LOGIN_HINT_DISMISSED_KEY = "gmok:loginHintDismissed";
