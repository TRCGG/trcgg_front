import {
  DefaultOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { MeResponse } from "@/data/types/auth";
import { isApiError } from "@/services/apiError";
import { getMe } from "@/services/auth";

type Me = MeResponse["data"] | null;

const ME_KEY = ["me"];

/** 로그인한 사용자 기준이라 세션이 끊기면 남아 있으면 안 되는 캐시. */
const USER_SCOPED_KEYS = ["guild", "adminPost"];

const isLoggedIn = (client: QueryClient) => !!client.getQueryData<Me>(ME_KEY)?.user?.username;

const expireSession = (client: QueryClient, onExpired: () => void) => {
  client.setQueryData<Me>(ME_KEY, null);
  client.setQueryData(["guilds"], []);
  client.removeQueries({
    predicate: (query) => USER_SCOPED_KEYS.includes(query.queryKey[0] as string),
  });
  onExpired();
};

/**
 * 401은 세션 만료가 아닐 때도 나와서 세션 검사만 거치는 /api/auth/me로 다시 확인한다.
 * 로그인 상태로 알고 있을 때만 확인해 비로그인 방문자의 401은 요청을 늘리지 않는다.
 */
const handleUnauthorized = (
  client: QueryClient,
  onExpired: () => void,
  error: unknown,
  queryKey?: QueryKey
) => {
  if (!isApiError(error) || error.status !== 401 || !isLoggedIn(client)) return;

  if (queryKey?.[0] === ME_KEY[0]) {
    // React Query는 재조회가 실패해도 이전 data를 남겨 두므로 직접 비워야 로그아웃 상태가 된다.
    expireSession(client, onExpired);
    return;
  }

  // 진행 중인 me 조회가 있으면 fetchQuery가 그 요청을 공유해 401이 몰려도 한 번만 확인한다.
  // 실패는 위 me 분기가 QueryCache onError로 다시 받아 처리한다.
  client.fetchQuery({ queryKey: ME_KEY, queryFn: getMe, staleTime: 0 }).catch(() => undefined);
};

export const createQueryClient = (defaultOptions: DefaultOptions, onExpired: () => void) => {
  const client: QueryClient = new QueryClient({
    defaultOptions,
    queryCache: new QueryCache({
      onError: (error, query) => handleUnauthorized(client, onExpired, error, query.queryKey),
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleUnauthorized(client, onExpired, error),
    }),
  });
  return client;
};
