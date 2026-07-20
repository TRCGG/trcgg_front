import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";

// 지속 레이아웃(persistent layout)용 페이지 타입. getLayout이 있으면 _app이 감싸서 렌더.
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
