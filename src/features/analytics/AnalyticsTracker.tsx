import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import useDemo from "@/hooks/demo/useDemo";
import { identifyUser, initAnalytics, setDemoProperty, trackPageview } from "@/utils/analytics";

const AnalyticsTracker = () => {
  const router = useRouter();
  const { userId, isAuthPending } = useGuildManagement();
  const { isDemo } = useDemo();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initAnalytics().then(setReady);
  }, []);

  // 첫 페이지뷰보다 먼저 등록해야 그 페이지뷰에도 데모 여부가 붙는다.
  useEffect(() => {
    if (ready) setDemoProperty(isDemo);
  }, [ready, isDemo]);

  // 데모의 로그인 사용자는 모두 같은 가짜 계정이라 식별하면 방문자가 한 사람으로 합쳐진다.
  useEffect(() => {
    if (!ready || isAuthPending || isDemo || !userId) return;
    identifyUser(userId);
  }, [ready, isAuthPending, isDemo, userId]);

  useEffect(() => {
    if (!ready) return undefined;
    trackPageview();
    router.events.on("routeChangeComplete", trackPageview);
    return () => {
      router.events.off("routeChangeComplete", trackPageview);
    };
  }, [ready, router.events]);

  return null;
};

export default AnalyticsTracker;
