import useDemo from "@/hooks/demo/useDemo";

/** 데모 모드 동안 화면 하단에 떠 있으며, 데모를 끝내는 유일한 출구다. */
const DemoBanner = () => {
  const { isDemo, exitDemo } = useDemo();
  if (!isDemo) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[90] flex justify-center px-4">
      <div className="flex max-w-full items-center gap-3 rounded-full border border-blueText2 bg-darkBg2/95 py-2 pl-5 pr-2 shadow-2xl backdrop-blur">
        <span className="h-2 w-2 shrink-0 rounded-full bg-yellow" />
        <span className="min-w-0 text-sm text-primary1">
          <b>데모</b>
          <span className="hidden text-primary2 sm:inline">
            {" "}
            · 가상의 클랜 데이터로 둘러보는 중
          </span>
        </span>
        <button
          type="button"
          onClick={exitDemo}
          className="shrink-0 rounded-full bg-bluePrimary px-4 py-1.5 text-sm font-bold text-white hover:bg-blueButton"
        >
          데모 끝내기
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;
