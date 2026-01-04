import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/services/apiService";
import { GuildsResponse, MeResponse } from "@/data/types/auth";
import { getGuilds, getMe } from "@/services/auth";

const encodeGuildId = (id: string): string => btoa(id);

const useGuildManagement = () => {
  const [guildId, setGuildId] = useState<string>("");

  const { data: guildsData, isLoading: isLoadingGuilds } = useQuery<ApiResponse<GuildsResponse>>({
    queryKey: ["guilds"],
    queryFn: () => getGuilds(),
    staleTime: 60 * 1000,
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
    handleGuildChange,
    isLoadingGuilds,
  };
};

export default useGuildManagement;
