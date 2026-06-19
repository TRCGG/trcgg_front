import Image, { StaticImageData } from "next/image";
import LaneTopLogo from "@/assets/images/laneTop.png";
import LaneJungleLogo from "@/assets/images/laneJungle.png";
import LaneMidLogo from "@/assets/images/laneMid.png";
import LaneSupportLogo from "@/assets/images/laneSupport.png";
import LaneBottomLogo from "@/assets/images/laneBottom.png";

const LANE_IMAGE_MAP: Record<string, StaticImageData> = {
  TOP: LaneTopLogo,
  JUG: LaneJungleLogo,
  MID: LaneMidLogo,
  ADC: LaneBottomLogo,
  SUP: LaneSupportLogo,
};

interface Props {
  position?: string | null;
  size?: number;
}

const LaneIcon = ({ position, size = 16 }: Props) => {
  const icon = position ? LANE_IMAGE_MAP[position] : null;
  if (!icon) {
    return <div style={{ width: size, height: size }} />;
  }
  return (
    <Image
      src={icon}
      alt={position || ""}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
};

export default LaneIcon;
