import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <h1>메인 페이지</h1>
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
