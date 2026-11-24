import fs from "fs";
import path from "path";
import type { GetStaticProps, NextPage } from "next";
import LegalDocument from "@/components/layout/LegalDocument";
import { fillTemplateVars } from "@/utils/markdown";

interface TermsPageProps {
  markdown: string;
}

const TermsPage: NextPage<TermsPageProps> = ({ markdown }) => (
  <LegalDocument title="이용약관" markdown={markdown} />
);

export const getStaticProps: GetStaticProps<TermsPageProps> = async () => {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content", "TERMS.md"), "utf8");
  return { props: { markdown: fillTemplateVars(markdown) } };
};

export default TermsPage;
