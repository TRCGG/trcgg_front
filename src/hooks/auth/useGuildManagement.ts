import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { GuildsResponse, MeResponse } from "@/data/types/auth";
import { getGuilds, getMe } from "@/services/auth";
import { getGuildById } from "@/services/guildMember";
import { GuildResponse, hasMinRole } from "@/data/types/guildMember";

const encodeGuildId = (id: string): string => btoa(id);

const useGuildManagement = () => {
  const [guildId, setGuildId] = useState<string>("");

  const { data: guildsData, isLoading: isLoadingGuilds } = useQuery<ApiResponse<GuildsResponse>>({
    queryKey: ["guilds"],
    queryFn: () => getGuilds(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: meData } = useQuery<ApiResponse<MeResponse>>({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 60 * 1000,
  });

  const guilds = useMemo(() => {
    const rawGuilds = guildsData?.data?.data || [];
    return rawGuilds.map((guild) => ({
      ...guild,
      id: encodeGuildId(guild.id),
    }));
  }, [guildsData]);

  const isLoggedIn = useMemo(() => {
    return !!meData?.data?.data?.user?.username;
  }, [meData]);

  const username = meData?.data?.data?.user?.global_name || meData?.data?.data?.user?.username;

  const currentRole = useMemo(
    () => guilds.find((guild) => guild.id === guildId)?.role,
    [guilds, guildId]
  );

  const { data: guildData } = useQuery<ApiResponse<GuildResponse>>({
    queryKey: ["guild", guildId],
    queryFn: () => getGuildById(guildId),
    enabled: !!guildId && isLoggedIn,
    staleTime: 30 * 1000,
  });

  // 업로드 권한: 업로더 이상이거나, 길드가 전체 업로드 허용(allowAllUploads)인 경우
  const canUploadReplay =
    hasMinRole(currentRole, "userUploader") || guildData?.data?.data?.allowAllUploads === true;

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
    currentRole,
    canUploadReplay,
    handleGuildChange,
    isLoadingGuilds,
  };
};

export default useGuildManagement;
