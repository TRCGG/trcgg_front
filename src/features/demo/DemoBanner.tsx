import useDemo from "@/hooks/demo/useDemo";

/** 데모 모드 동안 화면 하단에 떠 있으며, 데모를 끝내는 유일한 출구다. */
const DemoBanner = () => {
  const { isDemo, exitDemo } = useDemo();
  if (!isDemo) return null;

  // 어두운 화면 어디서든 눈에 띄도록 사이트에서 드문 골드 배경을 쓴다.
  return (
    <div className="fixed inset-x-0 bottom-4 z-[90] flex justify-center px-4">
      <div className="flex max-w-full items-center gap-4 rounded-2xl bg-landing-gold py-2.5 pl-5 pr-2.5 shadow-2xl ring-1 ring-black/20">
        <div className="min-w-0 text-board-onGold">
          <p className="text-[15px] font-bold leading-tight">데모 모드</p>
          <p className="text-xs leading-tight opacity-80">가상의 클랜 데이터로 둘러보는 중</p>
        </div>
        <button
          type="button"
          onClick={exitDemo}
          className="group inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-board-onGold px-4 py-2.5 text-sm font-bold text-white shadow-md transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-black hover:shadow-lg active:translate-y-0 active:scale-95"
        >
          데모 끝내기
          <span className="inline-block transition-transform duration-300 ease-out group-hover:rotate-90">
            ✕
          </span>
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
