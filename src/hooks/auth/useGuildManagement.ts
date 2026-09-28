import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GuildInfo, MeResponse } from "@/data/types/auth";
import { getGuilds, getMe } from "@/services/auth";
import { getGuildById } from "@/services/guildMember";
import { useGuildContext } from "@/hooks/auth/GuildContext";
import { GuildDetail, hasMinRole } from "@/data/types/guildMember";

const encodeGuildId = (id: string): string => btoa(id);

const useGuildManagement = () => {
  const { guildId, setGuildId } = useGuildContext();

  const { data: guildsData, isLoading: isLoadingGuilds } = useQuery<GuildInfo[]>({
    queryKey: ["guilds"],
    queryFn: () => getGuilds(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: meData } = useQuery<MeResponse["data"]>({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 60 * 1000,
  });

  const guilds = useMemo(() => {
    const rawGuilds = guildsData ?? [];
    return rawGuilds.map((guild) => ({
      ...guild,
      id: encodeGuildId(guild.id),
    }));
  }, [guildsData]);

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
    enabled: !!guildId && isLoggedIn,
    staleTime: 30 * 1000,
  });

  // 업로드 권한: 업로더 이상이거나, 길드가 전체 업로드 허용(allowAllUploads)인 경우
  const canUploadReplay =
    hasMinRole(currentRole, "userUploader") || guildData?.allowAllUploads === true;

  // 저장된 선택은 Provider가 복원한다. 여기서는 그래도 비어 있을 때 첫 길드로 채운다.
  useEffect(() => {
    if (!guildId && guilds.length > 0) {
      setGuildId(guilds[0].id);
    }
  }, [guildId, guilds, setGuildId]);

  return {
    guildId,
    guilds,
    isLoggedIn,
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
