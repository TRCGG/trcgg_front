import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTournamentCodes, issueTournamentCodes } from "@/services/tournament";
import { IssueTournamentCodesInput, TournamentCode } from "@/data/types/tournament";

const tournamentCodesKey = (guildId: string) => ["tournamentCodes", guildId];

export const useTournamentCodes = (guildId: string, enabled: boolean) =>
  useQuery<TournamentCode[]>({
    queryKey: tournamentCodesKey(guildId),
    queryFn: () => getTournamentCodes(guildId),
    enabled: enabled && !!guildId,
  });

export const useIssueTournamentCodes = (guildId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: IssueTournamentCodesInput) => issueTournamentCodes(guildId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tournamentCodesKey(guildId) }),
  });
};
