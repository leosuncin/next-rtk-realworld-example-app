import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import store from '@app/app/store';
import Footer from '@app/common/footer';
import Navbar from '@app/common/navbar';

const App = ({ Component, pageProps }: AppProps) => (
  <Provider store={store}>
    <Navbar />
    <Component {...pageProps} />
    <Footer />
  </Provider>
);

export default App;
