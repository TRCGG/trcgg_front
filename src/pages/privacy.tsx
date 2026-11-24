import fs from "fs";
import path from "path";
import type { GetStaticProps, NextPage } from "next";
import LegalDocument from "@/components/layout/LegalDocument";
import { fillTemplateVars } from "@/utils/markdown";

interface PrivacyPageProps {
  markdown: string;
}

const PrivacyPage: NextPage<PrivacyPageProps> = ({ markdown }) => (
  <LegalDocument title="개인정보처리방침" markdown={markdown} />
);

export const getStaticProps: GetStaticProps<PrivacyPageProps> = async () => {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content", "PRIVACY.md"), "utf8");
  return { props: { markdown: fillTemplateVars(markdown) } };
};

export default PrivacyPage;
