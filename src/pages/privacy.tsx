import fs from "fs";
import path from "path";
import type { GetStaticProps, NextPage } from "next";
import LegalDocument from "@/components/layout/LegalDocument";
import { renderMarkdown } from "@/utils/markdown";

interface PrivacyPageProps {
  html: string;
}

const PrivacyPage: NextPage<PrivacyPageProps> = ({ html }) => (
  <LegalDocument title="개인정보처리방침" html={html} />
);

export const getStaticProps: GetStaticProps<PrivacyPageProps> = async () => {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content", "PRIVACY.md"), "utf8");
  return { props: { html: renderMarkdown(markdown) } };
};

export default PrivacyPage;
