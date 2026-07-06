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
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="GMOK" />
          <meta property="og:title" content="롤 길드 전적 검색 - 지목 | GMOK.KR" />
          <meta
            property="og:description"
            content="리그 오브 레전드 길드 내 전적 검색 서비스를 제공하는 GMOK입니다."
          />
          <meta property="og:image" content={OG_IMAGE} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={SITE_URL} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={OG_IMAGE} />
        </Head>
        <body className="mb-16 min-w-[360px] px-2 md:px-0">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
