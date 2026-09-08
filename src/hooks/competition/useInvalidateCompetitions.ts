import { useQueryClient } from "@tanstack/react-query";

/**
 * 대회 관련 쿼리를 한꺼번에 무효화한다.
 *
 * 대회 목록·상세에는 신청 수·대기 수·팀 수·경기 수가 함께 실려 있어서, 신청 한 건만
 * 바뀌어도 여러 화면의 숫자가 어긋난다. 화면마다 지역 refetch를 부르면 방금 보고 있던
 * 화면만 맞고 다른 화면은 staleTime 동안 옛 숫자를 보여준다(신청 직후 목록에서
 * "0건 신청"이 보였던 이유).
 *
 * 활성 쿼리만 즉시 다시 받고 비활성 쿼리는 stale로 표시되므로, 넓게 무효화해도 요청이
 * 늘지 않는다. 챔피언 목록은 정적 참조 데이터라 제외한다.
 */
const useInvalidateCompetitions = () => {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      predicate: (query) => {
        const root = query.queryKey[0];
        if (typeof root !== "string") return false;
        return (
          root.startsWith("competition") ||
          root === "myCompetitionApplication" ||
          root === "playerCompetitions"
        );
      },
    });
};

export default useInvalidateCompetitions;
