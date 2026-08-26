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

// 자체 배경으로 화면을 꽉 채우고 푸터까지 직접 렌더링하는 페이지들.
// 공용 좌우 여백과 공용 푸터를 모두 적용하지 않는다.
const FULL_BLEED_PAGES = ["/about", "/faq", "/guide"];

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  // sprite 데이터 로드 최초 1회
  useSpriteLoader();

  // 페이지가 getLayout을 제공하면 그 레이아웃으로 감싸 렌더(라우트 전환 사이 레이아웃 유지)
  const getLayout = Component.getLayout ?? ((page) => page);

  const isFullBleed = FULL_BLEED_PAGES.includes(router.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        {/* 좌우 여백은 여기서만 준다. 푸터는 이 바깥에 있어야 화면을 꽉 채운다. */}
        <div className={`flex-1 ${isFullBleed ? "" : "px-2 md:px-0"}`}>
          {getLayout(<Component {...pageProps} />)}
        </div>
        {!isFullBleed && <Footer />}
      </div>
    </QueryClientProvider>
  );
};

export default MyApp;
