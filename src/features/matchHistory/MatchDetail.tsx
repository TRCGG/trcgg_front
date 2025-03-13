import MatchLoserDetail from "@/features/matchHistory/MatchLoserDetail";
import MatchWinnerDetail from "@/features/matchHistory/MatchWinnerDetail";

const MatchDetail = () => {
  return (
    <div className="flex flex-col">
      {/* 승리 팀 상세 정보 */}
      <MatchWinnerDetail
        players={[
          {
            name: "플레이어 A",
            championImage: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Jhin.png",
            kda: "6 / 6 / 6",
            damage: "999999",
            wards: "99",
          },
          {
            name: "플레이어 B",
            championImage: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png",
            kda: "5 / 2 / 10",
            damage: "85000",
            wards: "120",
          },
          {
            name: "플레이어 C",
            championImage: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Zed.png",
            kda: "4 / 4 / 12",
            damage: "75000",
            wards: "90",
          },
          {
            name: "플레이어 D",
            championImage: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Leona.png",
            kda: "7 / 3 / 15",
            damage: "105000",
            wards: "110",
          },
          {
            name: "플레이어 E",
            championImage: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Yasuo.png",
            kda: "3 / 6 / 9",
            damage: "70000",
            wards: "80",
          },
        ]}
      />

      {/* 패배 팀 상세 정보 */}
      <MatchLoserDetail
        players={[
          {
            name: "플레이어 F",
            championImage:
              "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ezreal.png",
            kda: "2 / 7 / 5",
            damage: "60000",
            wards: "50",
          },
          {
            name: "플레이어 G",
            championImage:
              "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Samira.png",
            kda: "6 / 5 / 8",
            damage: "90000",
            wards: "100",
          },
          {
            name: "플레이어 H",
            championImage:
              "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/LeeSin.png",
            kda: "4 / 8 / 10",
            damage: "80000",
            wards: "70",
          },
          {
            name: "플레이어 I",
            championImage:
              "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Morgana.png",
            kda: "3 / 9 / 7",
            damage: "65000",
            wards: "60",
          },
          {
            name: "플레이어 J",
            championImage:
              "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Thresh.png",
            kda: "5 / 6 / 11",
            damage: "85000",
            wards: "95",
          },
        ]}
      />
    </div>
  );
};

export default MatchDetail;
