import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Image from "next/image";
import MatchDetail from "@/features/matchHistory/MatchDetail";

const MatchItem = () => {
  const [isOpen, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!isOpen);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex bg-redDarken w-full h-auto min-h-24 rounded-md border-l-[15px] border-red">
        <div className="flex flex-1 items-center justify-between px-5">
          <div className="flex flex-1 items-center gap-14">
            {/* 챔피온 아이콘 */}
            <div>
              <Image
                width={48}
                height={48}
                alt="챔피언"
                src="https://ddragon.leagueoflegends.com/cdn/14.24.1/img/champion/Zed.png"
              />
            </div>

            {/* 챔피온 명 */}
            <div className="text-lg whitespace-nowrap">제드</div>
          </div>

          {/* KDA */}
          <div className="text-lg whitespace-nowrap">10 / 7 / 11</div>
        </div>

        {/* 펼치기 버튼 */}
        <div className="relative flex md:basis-10 md:flex-col justify-center">
          <button
            className="flex flex-1 flex-col justify-center items-center bg-red hover:bg-redHover rounded-md"
            type="button"
            onClick={toggleOpen}
          >
            <span className="sr-only">Show More Detail Games</span>
            <MdKeyboardArrowDown
              className={`text-[2rem] text-redLighten transition-transform duration-150 ease-out transform ${isOpen ? "rotate-[180deg]" : "rotate-[0deg]"}`}
            />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="flex flex-col w-full bg-redLighten rounded-md mb-5">
          <MatchDetail />
        </div>
      )}
    </div>
  );
};
export default MatchItem;
