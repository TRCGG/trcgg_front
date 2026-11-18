const STORAGE_KEY = "gmok:demo";

const listeners = new Set<() => void>();

let active: boolean | null = null;

const read = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

/** 데모 모드 여부. 탭을 닫으면 끝나도록 sessionStorage에 둔다. */
export const isDemoMode = (): boolean => {
  if (typeof window === "undefined") return false;
  if (active === null) active = read();
  return active;
};

export const setDemoMode = (next: boolean) => {
  active = next;
  try {
    if (next) sessionStorage.setItem(STORAGE_KEY, "1");
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소가 막혀도 이 탭에서는 메모리 값으로 동작한다.
  }
  listeners.forEach((listener) => listener());
};

export const subscribeDemoMode = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
