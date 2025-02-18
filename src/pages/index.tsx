import type { NextPage } from "next";

interface HomeProps {
  time: string;
}

export async function getServerSideProps() {
  return {
    props: {
      time: new Date().toISOString(),
    },
  };
}

const Home: NextPage<HomeProps> = ({ time }) => {
  return (
    <>
      <h1>SSR로 렌더링 된 페이지입니다. {time}</h1>
      <p className="text-xl font-bold text-primary1">tit-xl 난민 전적 검색 TRC.GG</p>
      <p className="text-lg font-bold text-primary2">tit-lg 난민 전적 검색 TRC.GG</p>
      <p className="text-base font-bold text-black">tit-md 난민 전적 검색 TRC.GG</p>
      <p className="text-sm font-normal text-border1">txt-lg 난민 전적 검색 TRC.GG</p>
      <p className="text-xs font-normal text-border2">txt-sm 난민 전적 검색 TRC.GG</p>

      <div className="bg-darkBg2 text-primary1 border border-border2">
        Primary1 배경 & DarkBg2 텍스트 & Border1 테두리
      </div>
    </>
  );
};

export default Home;
