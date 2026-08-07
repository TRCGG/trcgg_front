import fs from "fs";
import path from "path";
import type { GetStaticProps, NextPage } from "next";
import LegalDocument from "@/components/layout/LegalDocument";
import { renderMarkdown } from "@/utils/markdown";

interface TermsPageProps {
  html: string;
}

const TermsPage: NextPage<TermsPageProps> = ({ html }) => (
  <LegalDocument title="이용약관" html={html} />
);

export const getStaticProps: GetStaticProps<TermsPageProps> = async () => {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content", "TERMS.md"), "utf8");
  return { props: { html: renderMarkdown(markdown) } };
};

export default TermsPage;
