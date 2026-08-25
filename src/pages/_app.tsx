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

  // 아래 페이지들은 어두운 자체 배경 위에 푸터를 직접 렌더링하므로(사이 여백에 body 배경이 드러나는 것 방지) 공용 푸터 제외
  const showFooter = !["/about", "/faq", "/guide"].includes(router.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">{getLayout(<Component {...pageProps} />)}</div>
        {showFooter && <Footer />}
      </div>
    </QueryClientProvider>
  );
};

export default MyApp;
