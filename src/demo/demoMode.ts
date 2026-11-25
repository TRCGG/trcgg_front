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

const RETURN_PATH_KEY = "gmok:demo-return";

const isInternalPath = (path: string) => path.startsWith("/") && !path.startsWith("//");

/** 데모를 끝냈을 때 돌아갈 경로. 데모에 들어온 페이지를 기억해 둔다. */
export const saveDemoReturnPath = (path: string) => {
  try {
    sessionStorage.setItem(RETURN_PATH_KEY, path);
  } catch {
    // 저장하지 못하면 종료 시 기본 경로로 돌아간다.
  }
};

export const takeDemoReturnPath = (): string => {
  try {
    const path = sessionStorage.getItem(RETURN_PATH_KEY);
    sessionStorage.removeItem(RETURN_PATH_KEY);
    if (path && isInternalPath(path)) return path;
  } catch {
    // 읽지 못하면 기본 경로로 돌아간다.
  }
  return "/";
};

export const subscribeDemoMode = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
