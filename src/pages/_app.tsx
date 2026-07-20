import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import useSpriteLoader from "@/hooks/common/useSpriteLoader";
import Footer from "@/components/layout/Footer";
import { NextPageWithLayout } from "@/data/types/next";
import "@/styles/global.css";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  // sprite 데이터 로드 최초 1회
  useSpriteLoader();

  // 페이지가 getLayout을 제공하면 그 레이아웃으로 감싸 렌더(라우트 전환 사이 레이아웃 유지)
  const getLayout = Component.getLayout ?? ((page) => page);

  // /about은 자체 푸터를 포함하므로 공용 푸터 제외
  const showFooter = router.pathname !== "/about";

  return (
    <QueryClientProvider client={queryClient}>
      {getLayout(<Component {...pageProps} />)}
      {showFooter && <Footer />}
    </QueryClientProvider>
  );
};

export default MyApp;
