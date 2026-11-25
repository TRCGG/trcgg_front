import { useSyncExternalStore } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import { DEMO_FEATURED } from "@/demo/demoData";
import {
  isDemoMode,
  saveDemoReturnPath,
  setDemoMode,
  subscribeDemoMode,
  takeDemoReturnPath,
} from "@/demo/demoMode";

const useDemo = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isDemo = useSyncExternalStore(subscribeDemoMode, isDemoMode, () => false);

  // 실제 데이터와 데모 데이터가 같은 쿼리 키를 쓰므로, 모드를 바꿀 때마다 캐시를 통째로 비운다.
  const enterDemo = () => {
    saveDemoReturnPath(router.asPath);
    setDemoMode(true);
    queryClient.clear();
    router.push(
      `/summoners/${encodeURIComponent(DEMO_FEATURED.riotName)}/${encodeURIComponent(
        DEMO_FEATURED.riotNameTag
      )}`
    );
  };

  const exitDemo = () => {
    setDemoMode(false);
    queryClient.clear();
    router.push(takeDemoReturnPath());
  };

  return { isDemo, enterDemo, exitDemo };
};

export default useDemo;
