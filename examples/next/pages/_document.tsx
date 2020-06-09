import Document, { Head, Main, NextScript } from 'next/document';
import { StyleSheet } from 'react-context-theming/web';

export default class MyDocument extends Document {
  // static async getInitialProps(ctx) {
  //   const sheet = new ServerStyleSheet();
  //   const page = ctx.renderPage(App => props => sheet.collectStyles(<App {...props} />));
  //   const styleTags = sheet.getStyleElement();
  //   const initialProps = await Document.getInitialProps(ctx);
  //   return { ...initialProps, ...page, styleTags };
  // }
  
  render() {
    let seo;
    try {
      seo = this.props.__NEXT_DATA__.props.pageProps.seo;
    } catch(e) {}

    return (
      <html>
        <Head>
          <StyleSheet/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}