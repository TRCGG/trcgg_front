import { useEffect, useState } from "react";
import { LOGIN_HINT_DISMISSED_KEY, RETURNING_USER_KEY } from "@/constants/authHint";

const readFlag = (storage: Storage, key: string) => {
  try {
    return storage.getItem(key) === "1";
  } catch {
    return false;
  }
};

/** 예전에 로그인했던 방문자에게 로그인 버튼을 가리키는 말풍선. 로그인 버튼 감싸는 relative 요소 안에 둔다. */
const LoginHintBubble = () => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // 저장소는 브라우저에만 있어 마운트 후 읽는다.
  useEffect(() => {
    setVisible(
      readFlag(localStorage, RETURNING_USER_KEY) &&
        !readFlag(sessionStorage, LOGIN_HINT_DISMISSED_KEY)
    );
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(LOGIN_HINT_DISMISSED_KEY, "1");
    } catch {
      // 저장이 막혀도 이번 화면에서는 닫힌다.
    }
    // 동작 줄이기 설정이면 애니메이션이 없어 animationend가 오지 않는다.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }
    setLeaving(true);
  };

  return (
    <div
      role="status"
      onAnimationEnd={() => leaving && setVisible(false)}
      className={`absolute right-0 top-full z-50 mt-3 w-[280px] origin-top-right rounded-xl border border-landing-discord/40 bg-landing-bgElevated p-3.5 text-left shadow-[0_18px_48px_theme(colors.black/0.55)] ${
        leaving ? "animate-popOut" : "animate-popIn [animation-delay:600ms]"
      }`}
    >
      <span
        aria-hidden
        className="absolute -top-[7px] right-9 h-3 w-3 rotate-45 border-l border-t border-landing-discord/40 bg-landing-bgElevated"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 text-sm font-bold leading-snug text-landing-heading">다시 오셨네요</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="안내 닫기"
          className="-mr-1 shrink-0 rounded p-1 text-landing-micro transition-colors hover:text-landing-heading"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <p className="m-0 mt-1 text-[13px] leading-snug text-landing-bodySecondary [word-break:keep-all]">
        로그인하고 우리 클랜 전적을 이어서 보세요.
      </p>
    </div>
  );
};

export default LoginHintBubble;
