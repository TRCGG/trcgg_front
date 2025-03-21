import RankItem from "./RankItem";

const MostPickRank = () => {
  // 순위별 데이터 배열 임시 데이터
  const rankData = [
    {
      rank: 1,
      user: "진",
      kda: "8.27",
      winRate: 80,
      games: 15,
      championImg: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Jhin.png",
    },
    {
      rank: 2,
      user: "아리",
      kda: "5.27",
      winRate: 75,
      games: 9,
      championImg: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ahri.png",
    },
    {
      rank: 3,
      user: "야스오",
      kda: "6.90",
      winRate: 78,
      games: 7,
      championImg: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Yasuo.png",
    },
    {
      rank: 4,
      user: "제드",
      kda: "4.20",
      winRate: 68,
      games: 6,
      championImg: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Zed.png",
    },
    {
      rank: 5,
      user: "이즈리얼",
      kda: "3.95",
      winRate: 62,
      games: 5,
      championImg: "https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Ezreal.png",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {rankData.map((data) => (
        <RankItem key={data.rank} {...data} />
      ))}
    </div>
  );
};

export default MostPickRank;
