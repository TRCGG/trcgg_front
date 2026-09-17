import Document, { Html, Head, Main, NextScript } from "next/document";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://gmok.kr";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ko">
        <Head>
          {/* 브라우저 탭 아이콘(파비콘) */}
          <link rel="icon" type="image/png" href="/og-mini.png" />
          <link rel="shortcut icon" type="image/png" href="/og-mini.png" />
          <link rel="apple-touch-icon" href="/og-mini.png" />
          <meta
            name="description"
            content="리그 오브 레전드 내전 전적 검색. 리플레이를 올리면 디스코드 클랜 단위로 전적·챔피언 통계·상대전적이 쌓입니다."
          />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="GMOK.KR" />
          <meta property="og:title" content="롤 내전 전적·통계 - 지목 | GMOK.KR" />
          <meta
            property="og:description"
            content="리그 오브 레전드 내전 전적 검색. 리플레이를 올리면 디스코드 클랜 단위로 전적·챔피언 통계·상대전적이 쌓입니다."
          />
          <meta property="og:image" content={OG_IMAGE} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={SITE_URL} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={OG_IMAGE} />
          <script
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "GMOK.KR",
                alternateName: ["GMOK", "지목"],
                url: `${SITE_URL}/`,
              }),
            }}
          />
        </Head>
        {/* 좌우 여백은 body가 아니라 _app의 콘텐츠 영역에만 준다.
            body에 주면 푸터·전체폭 배경이 화면을 꽉 채우지 못하고 양옆에 body 배경이 드러난다. */}
        <body className="min-w-[360px]">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
