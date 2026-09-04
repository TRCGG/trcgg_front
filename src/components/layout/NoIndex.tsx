import Head from "next/head";

// 로그인·기능 전용 화면에 붙인다. 비로그인 크롤러에게는 안내 문구만 보여
// 애드센스 "게시자 콘텐츠가 없는 화면" 정책에 걸리므로 색인에서 제외한다.
// public/robots.txt의 Disallow와 짝이며, 이미 색인된 URL을 걷어내는 역할을 한다.
const NoIndex = () => (
  <Head>
    <meta name="robots" content="noindex" />
  </Head>
);

export default NoIndex;
