import { useQuery } from "@tanstack/react-query";
import { SiteSummary } from "@/data/types/statistics";
import { getSiteSummary } from "@/services/statistics";

const useSiteSummary = () =>
  useQuery<SiteSummary>({
    queryKey: ["siteSummary"],
    queryFn: getSiteSummary,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export default useSiteSummary;
