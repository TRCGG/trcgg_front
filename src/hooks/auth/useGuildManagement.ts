import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GuildInfo, MeResponse } from "@/data/types/auth";
import { getGuilds, getMe } from "@/services/auth";
import { getGuildById } from "@/services/guildMember";
import { GuildRow, hasMinRole } from "@/data/types/guildMember";

const encodeGuildId = (id: string): string => btoa(id);

const useGuildManagement = () => {
  const [guildId, setGuildId] = useState<string>("");

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

  const { data: guildData } = useQuery<GuildRow>({
    queryKey: ["guild", guildId],
    queryFn: () => getGuildById(guildId),
    enabled: !!guildId && isLoggedIn,
    staleTime: 30 * 1000,
  });

  // 업로드 권한: 업로더 이상이거나, 길드가 전체 업로드 허용(allowAllUploads)인 경우
  const canUploadReplay =
    hasMinRole(currentRole, "userUploader") || guildData?.allowAllUploads === true;

  useEffect(() => {
    if (typeof window !== "undefined" && guilds.length > 0) {
      const savedEncodedId = localStorage.getItem("guildId");
      if (savedEncodedId) {
        setGuildId(savedEncodedId);
      } else {
        localStorage.setItem("guildId", guilds[0].id);
        setGuildId(guilds[0].id);
      }
    }
  }, [guilds]);

  const handleGuildChange = (encodedGuildId: string) => {
    localStorage.setItem("guildId", encodedGuildId);
    setGuildId(encodedGuildId);
  };

  return {
    guildId,
    guilds,
    isLoggedIn,
    username,
    uploadNick,
    avatar,
    currentRole,
    canUploadReplay,
    handleGuildChange,
    isLoadingGuilds,
  };
};

export default useGuildManagement;
