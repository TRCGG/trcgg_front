import SpriteImage from "@/components/ui/SpriteImage";
import colors from "@/styles/colors";
import { getChampionSprite } from "@/utils/spriteLoader";

interface Props {
  en: string;
  size?: number;
  rounded?: number;
  /** 기준 플레이어(나) 표시용 파란 링 */
  mine?: boolean;
}

const ChampIcon = ({ en, size = 40, rounded = 2, mine = false }: Props) => {
  const icon = (
    <SpriteImage
      spriteData={getChampionSprite(en)}
      alt={en}
      width={size}
      height={size}
      fallbackSrc={`https://ddragon.leagueoflegends.com/cdn/${process.env.NEXT_PUBLIC_DDRAGON_VERSION}/img/champion/${en}.png`}
      className="object-cover"
    />
  );

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        boxShadow: mine ? `0 0 0 2px ${colors.blueText}` : undefined,
      }}
    >
      {icon}
    </div>
  );
};

export default ChampIcon;
