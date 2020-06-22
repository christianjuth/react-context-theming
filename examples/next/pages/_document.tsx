import Document, { Head, Main, NextScript } from 'next/document';
import { StyleSheet } from 'react-context-theming/web';

export default class MyDocument extends Document {  
  render() {
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