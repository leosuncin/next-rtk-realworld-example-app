import type { AppProps } from 'next/app';

import { wrapper } from '@app/app/store';
import Footer from '@app/common/footer';
import Navbar from '@app/common/navbar';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Navbar />
    <Component {...pageProps} />
    <Footer />
  </>
);

export default wrapper.withRedux(App);
