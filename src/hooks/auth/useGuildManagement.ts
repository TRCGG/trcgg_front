import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GuildInfo, MeResponse } from "@/data/types/auth";
import { getGuilds, getMe } from "@/services/auth";
import { getGuildById } from "@/services/guildMember";
import { useGuildContext } from "@/hooks/auth/GuildContext";
import usePublicGuilds from "@/hooks/auth/usePublicGuilds";
import { GuildDetail, hasMinRole } from "@/data/types/guildMember";

const encodeGuildId = (id: string): string => btoa(id);

// 내 길드와 겹치는 공개 길드는 role·nick이 있는 내 길드 항목을 남긴다
const mergeGuilds = (myGuilds: GuildInfo[], publicGuilds: GuildInfo[]): GuildInfo[] => {
  const myGuildIds = new Set(myGuilds.map((guild) => guild.id));
  return [...myGuilds, ...publicGuilds.filter((guild) => !myGuildIds.has(guild.id))];
};

const useGuildManagement = () => {
  const { guildId: selectedGuildId, setGuildId, resolveGuildId } = useGuildContext();

  const { data: guildsData, isLoading: isLoadingMyGuilds } = useQuery<GuildInfo[]>({
    queryKey: ["guilds"],
    queryFn: () => getGuilds(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { publicGuilds, isLoadingPublicGuilds } = usePublicGuilds();

  const { data: meData } = useQuery<MeResponse["data"]>({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 60 * 1000,
  });

  const isLoadingGuilds = isLoadingMyGuilds || isLoadingPublicGuilds;

  const myGuildIds = useMemo(
    () => new Set((guildsData ?? []).map((guild) => encodeGuildId(guild.id))),
    [guildsData]
  );

  const guilds = useMemo(
    () =>
      mergeGuilds(guildsData ?? [], publicGuilds).map((guild) => ({
        ...guild,
        id: encodeGuildId(guild.id),
      })),
    [guildsData, publicGuilds]
  );

  // 저장된 선택이 목록에 없으면(세션 만료, 탈퇴 등) 첫 길드를 쓰되 저장값은 덮어쓰지 않는다
  const guildId = guilds.some((guild) => guild.id === selectedGuildId)
    ? selectedGuildId
    : (guilds[0]?.id ?? "");

  const isMember = myGuildIds.has(guildId);
  const hasOwnGuild = myGuildIds.size > 0;

  const isLoggedIn = useMemo(() => {
    return !!meData?.user?.username;
  }, [meData]);

  const username = meData?.user?.global_name || meData?.user?.username;
  const avatar = meData?.user?.avatar;

  const currentRole = useMemo(
    () => guilds.find((guild) => guild.id === guildId)?.role,
    [guilds, guildId]
  );

  const uploadNick = useMemo(
    () => guilds.find((guild) => guild.id === guildId)?.nick || username,
    [guilds, guildId, username]
  );

  const { data: guildData } = useQuery<GuildDetail>({
    queryKey: ["guild", guildId],
    queryFn: () => getGuildById(guildId),
    enabled: !!guildId && isLoggedIn && isMember,
    staleTime: 30 * 1000,
  });

  // 업로드 권한: 업로더 이상이거나, 길드가 전체 업로드 허용(allowAllUploads)인 경우
  const canUploadReplay =
    hasMinRole(currentRole, "userUploader") || guildData?.allowAllUploads === true;

  // useGuildContext로 guildId를 직접 읽는 컴포넌트도 같은 길드를 보도록 맞춘다
  useEffect(() => {
    if (!isLoadingGuilds && guildId !== selectedGuildId) {
      resolveGuildId(guildId);
    }
  }, [isLoadingGuilds, guildId, selectedGuildId, resolveGuildId]);

  return {
    guildId,
    guilds,
    isLoggedIn,
    isMember,
    hasOwnGuild,
    memberGuildId: isMember ? guildId : "",
    username,
    uploadNick,
    avatar,
    currentRole,
    canUploadReplay,
    handleGuildChange: setGuildId,
    isLoadingGuilds,
  };
};

export default useGuildManagement;
