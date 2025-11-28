import { useQuery } from "@tanstack/react-query";
import { getGuilds } from "@/services/auth";
import { ApiResponse } from "@/services/apiService";
import { GuildsResponse } from "@/data/types/guild";

/**
 * Gmok Guilds 목록을 조회하는 훅
 */
const useGuildsQuery = () => {
  const { data, isLoading, isError } = useQuery<ApiResponse<GuildsResponse>>({
    queryKey: ["Guilds"],
    queryFn: () => getGuilds(),
    staleTime: 30 * 60 * 1000, // 30분
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export default useGuildsQuery;
