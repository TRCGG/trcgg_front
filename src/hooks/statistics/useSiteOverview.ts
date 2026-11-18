import { useQuery } from "@tanstack/react-query";
import { SiteOverview } from "@/data/types/statistics";
import { getSiteOverview } from "@/services/statistics";

const useSiteOverview = () =>
  useQuery<SiteOverview>({
    queryKey: ["siteOverview"],
    queryFn: getSiteOverview,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

export default useSiteOverview;
