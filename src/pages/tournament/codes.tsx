import type { NextPage } from "next";
import Head from "next/head";
import { ReactNode } from "react";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TitleBox from "@/components/ui/TitleBox";
import usePageHeader from "@/hooks/common/usePageHeader";
import { useTournamentCodes } from "@/hooks/tournament/useTournamentCodes";
import { canManageGuild } from "@/data/types/guildMember";
import TournamentIssuePanel from "@/features/tournament/TournamentIssuePanel";
import TournamentCodeList from "@/features/tournament/TournamentCodeList";

interface PanelProps {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

const Panel = ({ title, aside, children }: PanelProps) => (
  <section className="bg-darkBg2 border border-border2 rounded-lg overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border2">
      <h2 className="m-0 text-sm font-bold text-primary1">{title}</h2>
      {aside && <span className="ml-auto text-xs text-primary2 tabular-nums">{aside}</span>}
    </div>
    {children}
  </section>
);

const Notice = ({ text }: { text: string }) => (
  <div className="px-4 py-10 text-center text-sm text-primary2">{text}</div>
);

const TournamentCodesPage: NextPage = () => {
  const { headerProps, guildId, guilds, isLoggedIn, isMember, hasOwnGuild, currentRole } =
    usePageHeader();
  const canView = isLoggedIn && isMember;
  const canIssue = canView && canManageGuild(currentRole);
  const { data: codes = [], isLoading, isError } = useTournamentCodes(guildId, canView);

  const clanName = guilds.find((guild) => guild.id === guildId)?.name || "클랜";
  const pendingCount = codes.filter((code) => code.status === "PENDING").length;
  const completedCount = codes.filter((code) => code.status === "COMPLETED").length;

  const accessNotice = (() => {
    if (!isLoggedIn) return "로그인 후 이용해주세요";
    if (!hasOwnGuild) return "소속된 클랜이 없습니다";
    if (!isMember) return "소속된 클랜에서만 이용할 수 있습니다";
    return null;
  })();

  return (
    <div className="w-full md:max-w-[1080px] mx-auto">
      <Head>
        <title>토너먼트 코드 - GMOK</title>
      </Head>
      <NoIndex />
      <SummonerPageHeader {...headerProps} />

      <TitleBox
        className="mt-10"
        clanName={clanName}
        title="토너먼트 코드"
        description="토너먼트 코드로 방을 만들면 리플레이를 올리지 않아도 경기 결과가 자동으로 기록됩니다."
      />

      {accessNotice ? (
        <div className="mt-4 mb-10 bg-darkBg2 border border-border2 rounded-lg">
          <Notice text={accessNotice} />
        </div>
      ) : (
        <div className="mt-4 mb-10 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4 items-start">
          <Panel title="새 코드 발급">
            {canIssue ? (
              <TournamentIssuePanel guildId={guildId} />
            ) : (
              <Notice text="코드 발급은 클랜 운영진만 할 수 있습니다" />
            )}
          </Panel>
          <Panel title="발급한 코드" aside={`대기 ${pendingCount} · 완료 ${completedCount}`}>
            <TournamentCodeList codes={codes} isLoading={isLoading} isError={isError} />
          </Panel>
        </div>
      )}
    </div>
  );
};

export default TournamentCodesPage;
