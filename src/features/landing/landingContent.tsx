import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { DISCORD_BOT_INSTALL_URL } from "@/constants/links";
import addBot from "@/assets/aboutImages/add-bot.png";
import dashboard from "@/assets/aboutImages/dashboard.png";
import replayDownload from "@/assets/aboutImages/download.png";
import replayUpload from "@/assets/aboutImages/upload.png";
import tournamentShareCode from "@/assets/aboutImages/tournament-share-code.png";
import tournamentEnterCode from "@/assets/aboutImages/tournament-enter-code.png";
import tournamentIssueCode from "@/assets/aboutImages/tournament-issue-code.png";
import colors from "@/styles/colors";
import { withAlpha } from "@/utils/color";

export interface FlowStepTheme {
  grad: string;
  glow: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
}

const DISCORD_THEME: FlowStepTheme = {
  grad: `linear-gradient(135deg,${colors.landing.periwinkle},${colors.landing.discord})`,
  glow: colors.landing.discord,
  badgeColor: colors.landing.periwinkle,
  badgeBg: withAlpha(colors.landing.discord, 0.12),
  badgeBorder: withAlpha(colors.landing.discord, 0.3),
};

const GOLD_THEME: FlowStepTheme = {
  grad: `linear-gradient(135deg,${colors.landing.goldLight},${colors.landing.gold})`,
  glow: colors.landing.gold,
  badgeColor: colors.landing.goldMuted,
  badgeBg: withAlpha(colors.landing.gold, 0.12),
  badgeBorder: withAlpha(colors.landing.gold, 0.3),
};

export interface FlowStep {
  theme: FlowStepTheme;
  badge: string;
  title: string;
  body: ReactNode;
  /** 캡처가 아직 없는 단계는 비워 두고 글만 보여 준다. */
  shot?: { img: StaticImageData; alt: string; bar: string };
}

export interface LandingContent {
  hero: { lead: string; highlight: string; description: ReactNode; points: string[] };
  flow: { title: string; description: string; steps: FlowStep[] };
  cta: { description: ReactNode };
}

const Strong = ({ children }: { children: ReactNode }) => (
  <b style={{ color: colors.landing.headingSm }}>{children}</b>
);

const GmokDomain = () => (
  <span style={{ color: colors.landing.gold }} className="font-mono">
    gmok.kr
  </span>
);

const BOT_INVITE_STEP: FlowStep = {
  theme: DISCORD_THEME,
  badge: "DISCORD",
  title: "디스코드 봇 초대",
  body: (
    <>
      클랜 디스코드 서버에{" "}
      <a
        href={DISCORD_BOT_INSTALL_URL}
        target="_blank"
        rel="noreferrer"
        className="font-bold text-landing-periwinkle hover:text-landing-periwinkleHover"
      >
        GMOK 봇을 초대
      </a>
      하면 클랜이 자동으로 등록됩니다. 봇 초대는 <Strong>서버 관리 권한</Strong>이 있어야 할 수
      있으니, 권한이 없다면 클랜 운영진에게 요청해 주세요.
    </>
  ),
  shot: {
    img: addBot,
    alt: "디스코드 봇 초대 — 서버에 GMOK 봇 추가",
    bar: "discord.com · 봇 초대",
  },
};

export const REPLAY_LANDING: LandingContent = {
  hero: {
    lead: "게임의 모든 순간을",
    highlight: "클랜과 함께",
    description: (
      <>
        게임이 끝나면 사라지는 순간들, 이제 리플레이 업로드로 남겨두세요.
        <br />
        전적·통계·랭킹이 두고두고 쌓이는 우리 클랜만의 전적 사이트.
      </>
    ),
    points: ["모든 기능 무료", "리플레이만 올리면 자동 집계", "부캐 전적까지 합산"],
  },
  flow: {
    title: "봇 초대부터 전적 확인까지",
    description:
      "봇 초대는 처음 한 번만. 그다음부터는 리플레이 다운로드부터 전적 집계까지 GMOK이 알아서 이어줍니다.",
    steps: [
      BOT_INVITE_STEP,
      {
        theme: GOLD_THEME,
        badge: "CLIENT",
        title: "리플레이 파일 다운로드",
        body: (
          <>
            경기가 끝나면 롤 클라이언트 <Strong>대전 기록</Strong>에서 내전 경기의{" "}
            <Strong>다운로드 버튼(↓)</Strong>을 눌러 <Strong>.rofl</Strong> 파일을 받아 둡니다.
            리플레이는 현재 패치의 경기만 받을 수 있습니다.
          </>
        ),
        shot: {
          img: replayDownload,
          alt: "리플레이 파일 다운로드 — 클라이언트 대전 기록",
          bar: "League of Legends · 대전 기록",
        },
      },
      {
        theme: GOLD_THEME,
        badge: "WEB",
        title: "리플레이 파일 업로드",
        body: (
          <>
            상단 메뉴의 <Strong>리플레이 업로드</Strong>에 받은 <Strong>.rofl</Strong> 파일을
            드래그&amp;드롭하면 끝. 한 번에 최대 10개까지 올릴 수 있고, 이미 등록된 경기는 중복으로
            쌓이지 않습니다.
          </>
        ),
        shot: {
          img: replayUpload,
          alt: "리플레이 파일 업로드 — gmok.kr 리플레이 업로드",
          bar: "gmok.kr · 리플레이 업로드",
        },
      },
      {
        theme: GOLD_THEME,
        badge: "WEB",
        title: "전적 확인",
        body: (
          <>
            업로드가 끝나면 <GmokDomain />
            에서 모스트 픽·포지션 승률·KDA·랭킹이 자동으로 집계되어 한눈에 확인됩니다.
          </>
        ),
        shot: { img: dashboard, alt: "전적 확인 — gmok.kr 대시보드", bar: "gmok.kr" },
      },
    ],
  },
  cta: {
    description: (
      <>
        디스코드에 봇을 초대하고 결과를 <Strong>업로드</Strong>하면 끝.
        <br className="hidden sm:block" /> 설치도, 회원가입도, 비용도 없습니다.
      </>
    ),
  },
};

export const TOURNAMENT_LANDING: LandingContent = {
  hero: {
    lead: "토너먼트 코드로",
    highlight: "내전하기",
    description: (
      <>
        GMOK은 디스코드 커뮤니티의 리그 오브 레전드 사용자 설정 게임(내전·스크림·대회) 전적을
        기록하는 무료 서비스입니다.
        <br />
        토너먼트 코드를 쓰면 리플레이 파일을 올리지 않아도 경기 결과가 자동으로 기록됩니다.
      </>
    ),
    points: ["모든 기능 무료", "리플레이 업로드 없이 자동 기록", "단판·BO3·BO5 코드 발급"],
  },
  flow: {
    title: "코드 발급부터 전적 확인까지",
    description:
      "클랜 관리자가 코드를 발급하면, 경기 결과 기록부터 전적 집계까지 GMOK이 알아서 이어줍니다.",
    steps: [
      {
        theme: GOLD_THEME,
        badge: "WEB",
        title: "토너먼트 코드 발급",
        body: (
          <>
            클랜 관리자가 <GmokDomain />의 토너먼트 코드 화면에서{" "}
            <Strong>경기 방식(단판·BO3·BO5)</Strong>과 <Strong>관전 허용 여부</Strong>를 골라 코드를
            발급받습니다. 세트마다 코드가 1개씩 발급되고, 다음 세트에 쓸 코드가 맨 위에 표시됩니다.
          </>
        ),
        shot: {
          img: tournamentIssueCode,
          alt: "토너먼트 코드 발급 — gmok.kr 토너먼트 코드",
          bar: "gmok.kr · 토너먼트 코드",
        },
      },
      {
        theme: DISCORD_THEME,
        badge: "DISCORD",
        title: "참가자에게 코드 공유",
        body: <>발급받은 코드를 디스코드 채널 등으로 참가자들에게 공유합니다.</>,
        shot: {
          img: tournamentShareCode,
          alt: "토너먼트 코드 공유 — 디스코드 채널",
          bar: "discord.com · 코드 공유",
        },
      },
      {
        theme: GOLD_THEME,
        badge: "CLIENT",
        title: "코드로 방 입장",
        body: (
          <>
            참가자 10명이 롤 클라이언트에 <Strong>같은 코드</Strong>를 입력해 방에 입장하고
            경기합니다.
          </>
        ),
        shot: {
          img: tournamentEnterCode,
          alt: "토너먼트 코드 입력 — 롤 클라이언트",
          bar: "League of Legends · 토너먼트 코드",
        },
      },
      {
        theme: GOLD_THEME,
        badge: "AUTO",
        title: "결과 자동 기록",
        body: (
          <>
            경기가 끝나면 결과가 <Strong>자동으로 기록</Strong>됩니다. 다음 세트는 발급받은 다음
            코드로 새 방을 만들어 진행합니다.
          </>
        ),
      },
      {
        theme: GOLD_THEME,
        badge: "WEB",
        title: "전적 확인",
        body: (
          <>
            참가자는 <GmokDomain />
            에서 전적·승률·랭킹을 확인합니다.
          </>
        ),
        shot: { img: dashboard, alt: "전적 확인 — gmok.kr 대시보드", bar: "gmok.kr" },
      },
    ],
  },
  cta: {
    description: (
      <>
        코드를 발급하고 같은 방에서 경기하면 <Strong>기록까지 끝</Strong>.
        <br className="hidden sm:block" /> 설치도, 회원가입도, 비용도 없습니다.
      </>
    ),
  },
};
