import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import Card from "@/components/ui/Card";
import usePageHeader from "@/hooks/common/usePageHeader";

const NotFound: NextPage = () => {
  const { headerProps } = usePageHeader();

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <Head>
        <title>페이지를 찾을 수 없습니다 - GMOK</title>
      </Head>
      <SummonerPageHeader {...headerProps} />
      <main>
        <Card className="w-full mt-14">
          <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <p className="text-3xl font-bold text-primary3">404</p>
            <h1 className="text-base text-primary1">페이지를 찾을 수 없습니다</h1>
            <p className="text-xs text-primary2">
              주소가 잘못되었거나 페이지가 이동·삭제되었을 수 있습니다.
            </p>
            <div className="mt-4 flex gap-2">
              <Link href="/">
                <a className="flex h-9 items-center rounded bg-bluePrimary px-4 text-[13px] text-white">
                  홈으로
                </a>
              </Link>
              <Link href="/guide">
                <a className="flex h-9 items-center rounded border border-border1 px-4 text-[13px] text-primary1 hover:border-blueText2">
                  이용방법 보기
                </a>
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default NotFound;
