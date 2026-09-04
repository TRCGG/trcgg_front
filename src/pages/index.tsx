import React, { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import NavBar from "@/components/layout/NavBar";
import SearchBar from "@/components/form/SearchBar";
import DiscordLoginButton from "@/components/ui/DiscordLoginButton";
import NoGuildModal from "@/features/discordLogin/NoGuildModal";
import GuildDropdown from "@/features/discordLogin/GuildDropdown";
import SearchBarResultList from "@/features/search/SearchBarResultList";
import RecentSearchList from "@/features/search/RecentSearchList";
import useModal from "@/hooks/common/useModal";
import useClickOutside from "@/hooks/common/useClickOutside";
import useUserSearchController from "@/hooks/searchUserList/useUserSearchController";
import useGuildManagement from "@/hooks/auth/useGuildManagement";
import MainLogo from "@/assets/images/mainLogo.png";

const FeatureCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="rounded-lg border border-border2 bg-darkBg2 p-4">
    <h3 className="text-[15px] font-bold text-primary1">{title}</h3>
    <p className="mt-1.5 text-[13px] leading-relaxed text-primary2">{desc}</p>
  </div>
);

const Step = ({ no, title, desc }: { no: string; title: string; desc: string }) => (
  <li className="flex gap-3">
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blueText/10 text-[11px] font-bold text-blueText">
      {no}
    </span>
    <div className="min-w-0">
      <div className="text-sm font-bold text-primary1">{title}</div>
      <p className="mt-1 text-[13px] leading-relaxed text-primary2">{desc}</p>
    </div>
  </li>
);

const LinkButton = ({ href, label }: { href: string; label: string }) => (
  <Link href={href}>
    <a className="group inline-flex items-center gap-2 rounded-lg border border-border2 bg-darkBg2 px-4 py-2.5 text-sm font-bold text-primary1 transition-colors hover:border-blueText2 hover:bg-rankBg3 hover:text-blueText">
      {label}
      <svg
        className="h-3.5 w-3.5 text-blueText transition-transform group-hover:translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  </Link>
);

const Home: NextPage = () => {
  const router = useRouter();
  const {
    isOpen: isNoGuildModalOpen,
    open: openNoGuildModal,
    close: closeNoGuildModal,
  } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [nameLengthAlert, toggleNameLengthAlert] = useState(false);

  const { guildId, guilds, isLoggedIn, username, handleGuildChange, isLoadingGuilds } =
    useGuildManagement();

  const { data, isLoading, isError, handleSearchButtonClick } = useUserSearchController(
    searchTerm,
    guildId
  );

  // 검색 실행 (페이지 이동 후 해당 페이지 useEffect에서 최근 검색어 저장)
  const handleSearch = () => {
    handleSearchButtonClick();
  };

  // 최근 검색어 클릭 핸들러
  const handleRecentSearchClick = (riotName: string, riotTag: string) => {
    router.push(`/summoners/${encodeURIComponent(riotName)}/${encodeURIComponent(riotTag)}`);
  };

  // 로그인 했지만 가입된 길드가 없을 때 모달 띄움
  useEffect(() => {
    if (isLoggedIn && !isLoadingGuilds && guilds.length === 0) {
      openNoGuildModal();
    }
  }, [isLoggedIn, isLoadingGuilds, guilds, openNoGuildModal]);

  useEffect(() => {
    if (searchTerm.length < 2 && searchTerm !== "") {
      toggleNameLengthAlert(true);
    } else {
      toggleNameLengthAlert(false);
    }
  }, [searchTerm]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useClickOutside(searchContainerRef, () => setIsSearchFocused(false));

  const handleDiscordLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {/* 헤더 영역 */}
      <header className="flex flex-col w-full gap-10 md:gap-20 justify-end">
        <title>GMOK</title>
        <div className="self-end m-3 flex gap-3 items-center">
          {isLoggedIn && (
            <GuildDropdown
              guilds={guilds}
              selectedGuildId={guildId}
              onGuildChange={handleGuildChange}
            />
          )}
          <DiscordLoginButton onClick={handleDiscordLogin} username={username} />
        </div>
        <div className="flex w-[250px] h-[250px] md:w-[400px] md:h-[400px] mx-auto">
          <Image src={MainLogo} alt="메인 로고" />
        </div>
      </header>

      <main className="flex flex-col my-10 w-full md:w-[40rem] max-w-[40rem] mt-16 mx-auto px-5">
        {/* NavBar */}
        <div className="mb-2">
          <NavBar />
        </div>
        <div ref={searchContainerRef}>
          {/* 검색창 */}
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="플레이어 이름#KR1"
            onFocus={() => setIsSearchFocused(true)}
          />
          {/* 검색 결과 또는 최근 검색어 */}
          {searchTerm.length >= 2 ? (
            <SearchBarResultList
              isLoading={isLoading}
              isError={isError}
              users={data?.data}
              enable={isSearchFocused}
              searchTerm={searchTerm}
            />
          ) : (
            <RecentSearchList enable={isSearchFocused} onSearchClick={handleRecentSearchClick} />
          )}
        </div>
        {/* 검색 경고메세지 */}
        {nameLengthAlert && (
          <div className="text-blueText text-md">최소 2글자 이상 작성해주세요.</div>
        )}

        {/* 서비스 소개 배너 */}
        <Link href="/about">
          <span className="group mt-6 inline-flex cursor-pointer items-center gap-2 self-center rounded-full border border-border2 bg-darkBg2 px-4 py-2 text-sm text-primary2 transition-colors hover:border-blueText2 hover:text-primary1">
            <span>GMOK이 처음이신가요?</span>
            <span className="font-bold text-blueText">서비스 소개 보기</span>
            <svg
              className="w-3.5 h-3.5 text-blueText transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </Link>
      </main>

      {/* 서비스 설명. 비로그인 방문자와 검색엔진에는 이 영역이 사이트의 유일한 본문이다
          (주요 화면은 로그인 후에만 데이터가 보이므로) — 문구를 이미지가 아닌 텍스트로 둔다. */}
      <section className="w-full max-w-[60rem] mx-auto mt-20 border-t border-border2 px-5 pb-16 pt-12 md:mt-28 md:pt-14">
        <h1 className="text-xl md:text-2xl font-bold text-primary1">
          롤 내전 전적, 우리 클랜만의 기록으로
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-primary2">
          GMOK은 리그 오브 레전드 <b className="text-primary1">내전(커스텀 게임)</b> 전적을 기록하고
          분석하는 서비스입니다. 경기가 끝난 뒤 리플레이 파일(.rofl)을 올리면 결과가 자동으로
          분석되어, 디스코드 서버(클랜) 단위로 전적·통계·랭킹이 쌓입니다. 솔로랭크나 일반 게임
          전적은 다루지 않습니다 — 일반 전적 사이트에서는 볼 수 없는, 우리 클랜이 직접 치른 내전
          기록만 모읍니다.
        </p>

        <h2 className="mt-10 text-base font-bold text-primary1">소환사를 검색하면 볼 수 있는 것</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <FeatureCard
            title="경기 상세"
            desc="10인 스코어보드를 아이템·룬·스펠까지 그대로 봅니다. KDA와 킬 관여율, 가한 피해와 받은 피해, 시야 점수를 경기별로 짚어가며 복기할 수 있습니다."
          />
          <FeatureCard
            title="챔피언 통계"
            desc="챔피언별 판수·승률·KDA를 포지션 필터와 기간 필터(최근·시즌·월 범위)로 좁혀 봅니다. 주력 챔피언과 숙련도를 한눈에 파악할 수 있습니다."
          />
          <FeatureCard
            title="상대전적 (H2H)"
            desc="특정 상대와의 맞대결 승률, 라인별 매치업, 듀오 조합 승률, 연승·연패 흐름까지. 누가 우위에 있는지 데이터로 확인합니다."
          />
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-primary2">
          개인 전적과 별개로 <b className="text-primary1">챔피언 분석</b>과{" "}
          <b className="text-primary1">유저 분석</b>에서는 클랜 전체 단위의 랭킹을 봅니다. 우리
          내전에서 어떤 챔피언이 강한지, 클랜원 중 누가 앞서 있는지 판수·승률·KDA 기준으로 정렬해
          확인할 수 있습니다. 부계정은 본계정에 합산해 집계됩니다.
        </p>

        <h2 className="mt-10 text-base font-bold text-primary1">이용 순서</h2>
        <ol className="mt-3 flex flex-col gap-4">
          <Step
            no="01"
            title="리플레이 파일 받기"
            desc="롤 클라이언트의 대전 기록에서 내전 경기를 선택하고 다운로드 버튼(↓)을 누릅니다. 파일은 문서 폴더 안 League of Legends 하위 Replays 폴더에 저장됩니다. 리플레이는 현재 패치의 경기만 받을 수 있어, 내전이 끝나면 바로 받아 두는 것이 좋습니다."
          />
          <Step
            no="02"
            title="업로드"
            desc="상단 메뉴의 리플레이 업로드에서 .rofl 파일을 드래그 앤 드롭하면 경기가 자동으로 전적에 반영됩니다. 파일당 최대 50MB, 한 번에 최대 10개까지 올릴 수 있고 이미 등록된 경기는 중복으로 쌓이지 않습니다."
          />
          <Step
            no="03"
            title="전적 확인"
            desc="검색창에 닉네임#태그 형식으로 검색하면 해당 소환사의 내전 전적이 종합·챔피언·상대전적 세 개 탭으로 정리되어 나타납니다."
          />
        </ol>

        <h2 className="mt-10 text-base font-bold text-primary1">시작하기</h2>
        <p className="mt-3 text-sm leading-relaxed text-primary2">
          로그인과 클랜 식별에는 디스코드 계정을 사용합니다. 별도 회원가입은 없고, 클라이언트를 따로
          설치할 필요도 없습니다. 소속된 디스코드 서버가 GMOK에 등록되어 있으면 로그인 후 목록에
          자동으로 나타나며, 여러 클랜에 속해 있다면 상단 드롭다운으로 전환할 수 있습니다. 업로드는
          클랜 운영진에게 권한을 받은 멤버가 할 수 있습니다(클랜 설정에 따라 전원 허용일 수
          있습니다).
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <LinkButton href="/about" label="서비스 소개" />
          <LinkButton href="/guide" label="이용 방법 자세히 보기" />
          <LinkButton href="/faq" label="자주 묻는 질문" />
        </div>
      </section>

      <NoGuildModal isOpen={isNoGuildModalOpen} onClose={closeNoGuildModal} />
    </div>
  );
};

export default Home;
