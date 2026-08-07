import Head from "next/head";
import Link from "next/link";
import TextLogo from "@/assets/images/textLogo.png";

interface LegalDocumentProps {
  title: string;
  html: string;
}

const LegalDocument = ({ title, html }: LegalDocumentProps) => (
  <>
    <Head>
      <title>{`${title} | GMOK`}</title>
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
      {/* eslint-disable-next-line react/no-danger */}
      <article className="legal-doc" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  </>
);

export default LegalDocument;
