import Image from "next/image";
import LaneMidLogo from "@/assets/images/laneMid.png";
import Jhin from "@/assets/images/userStatBgJhin.png";

interface Props {
  riotName: string | null;
}

const userStatsOverview = ({ riotName }: Props) => {
  return (
    <div
      className="flex bg-darkBg2 text-primary1 p-4 rounded border border-border2 relative bg-no-repeat bg-right-top "
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0) 100%), url(${Jhin.src})`,
        backgroundPosition: "top right",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 라인 로고 */}
      <div>
        <Image src={LaneMidLogo} alt="logo" width={160} height={160} />
      </div>

      {/* 유저 정보 */}
      <div className="flex flex-col p-4 text-lg gap-3">
        <div className="text-4xl font-bold">{riotName}</div>
        <div className="flex items-center gap-3 text-center">
          <div className="rounded-lg bg-primary1 text-darkBg2 w-12 font-bold">전체</div>
          <div>85전 50승 35패 (58.82%)</div>
        </div>
        <div className="flex items-center gap-3 text-center">
          <div className="rounded-lg bg-primary1 text-darkBg2 w-12 font-bold">이번달</div>
          <div>10전 3승 7패 (30%)</div>
        </div>
      </div>
    </div>
  );
};
export default userStatsOverview;
