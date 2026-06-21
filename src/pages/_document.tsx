import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ko">
        <Head />
        <body className="mb-16 min-w-[360px] px-2 md:px-0">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
