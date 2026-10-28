import type { NextPage } from "next";
import Head from "next/head";
import { ReactNode, useState } from "react";
import SummonerPageHeader from "@/components/layout/SummonerPageHeader";
import NoIndex from "@/components/layout/NoIndex";
import TitleBox from "@/components/ui/TitleBox";
import usePageHeader from "@/hooks/common/usePageHeader";
import { useTournamentCodes } from "@/hooks/tournament/useTournamentCodes";
import { canManageGuild } from "@/utils/role";
import TournamentCodeIssuePanel from "@/features/tournament/TournamentCodeIssuePanel";
import TournamentCodeList from "@/features/tournament/TournamentCodeList";
import { PUBLIC_CODE_ISSUE_GUILD_ID } from "@/features/tournament/tournamentMeta";
import { TournamentCode } from "@/data/types/tournament";

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

const TournamentCodesPage: NextPage = () => {
  const { headerProps, guildId, guilds, isLoggedIn, isMember, currentRole } = usePageHeader();
  const canIssue = isLoggedIn && isMember && canManageGuild(currentRole);
  // 운영진이 아니면 임시 길드 ID로 발급하고, 목록 API는 세션이 필요해 이번에 발급한 코드만 보여 준다.
  const [publicCodes, setPublicCodes] = useState<TournamentCode[]>([]);
  const guildCodes = useTournamentCodes(guildId, canIssue);
  const codes = canIssue ? (guildCodes.data ?? []) : publicCodes;

  const clanName = guilds.find((guild) => guild.id === guildId)?.name || "클랜";
  const pendingCount = codes.filter((code) => code.status === "PENDING").length;
  const completedCount = codes.filter((code) => code.status === "COMPLETED").length;

  const handlePublicCodesIssued = (issued: TournamentCode[]) =>
    setPublicCodes((prev) => [...issued, ...prev]);

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

      <div className="mt-4 mb-10 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-4 items-start">
        <Panel title="새 코드 발급">
          {canIssue ? (
            <TournamentCodeIssuePanel guildId={guildId} />
          ) : (
            <TournamentCodeIssuePanel
              guildId={PUBLIC_CODE_ISSUE_GUILD_ID}
              onIssued={handlePublicCodesIssued}
            />
          )}
        </Panel>
        <Panel title="발급한 코드" aside={`대기 ${pendingCount} · 완료 ${completedCount}`}>
          <TournamentCodeList
            codes={codes}
            isLoading={canIssue && guildCodes.isLoading}
            isError={canIssue && guildCodes.isError}
          />
        </Panel>
      </div>
    </div>
  );
};

export default TournamentCodesPage;
