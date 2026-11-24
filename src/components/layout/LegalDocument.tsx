import Head from "next/head";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TextLogo from "@/assets/images/textLogo.png";
import { legalUrlTransform, remarkHeadingIds } from "@/utils/markdown";

const REMARK_PLUGINS = [remarkGfm, remarkHeadingIds];

interface LegalDocumentProps {
  title: string;
  markdown: string;
}

const LegalDocument = ({ title, markdown }: LegalDocumentProps) => (
  <>
    <Head>
      <title>{`${title} - GMOK`}</title>
    </Head>
    <div className="mx-auto w-full max-w-[820px] px-5 py-10 md:py-14">
      <Link href="/">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={TextLogo.src}
          alt="GMOK"
          className="mb-8 h-[26px] w-auto cursor-pointer opacity-90 hover:opacity-100"
        />
      </Link>
      <article className="legal-doc">
        <ReactMarkdown remarkPlugins={REMARK_PLUGINS} urlTransform={legalUrlTransform}>
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  </>
);

export default LegalDocument;
