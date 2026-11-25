import type { PostHog } from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

type AnalyticsEvents = {
  demo_entered: undefined;
  demo_exited: undefined;
  summoner_searched: undefined;
  replay_uploaded: { succeeded: number; failed: number };
  competition_applied: undefined;
};

let client: PostHog | null = null;
let loading: Promise<boolean> | null = null;

// posthog-js(약 125KB gzip)를 첫 번들에서 빼려고 마운트 후에 불러온다.
// 키가 없는 환경(로컬·dev)에서는 불러오지도 보내지도 않아 운영 통계에 섞이지 않는다.
export const initAnalytics = (): Promise<boolean> => {
  if (!POSTHOG_KEY) return Promise.resolve(false);
  if (!loading) {
    loading = import("posthog-js").then(({ default: posthog }) => {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        disable_session_recording: true,
      });
      client = posthog;
      return true;
    });
  }
  return loading;
};

export const trackPageview = () => {
  client?.capture("$pageview");
};

export const track = <E extends keyof AnalyticsEvents>(
  ...[event, properties]: AnalyticsEvents[E] extends undefined
    ? [event: E]
    : [event: E, properties: AnalyticsEvents[E]]
) => {
  client?.capture(event, properties);
};

export const identifyUser = (userId: string) => {
  client?.identify(userId);
};

export const resetUser = () => {
  client?.reset();
};

export const setDemoProperty = (isDemo: boolean) => {
  client?.register({ is_demo: isDemo });
};
