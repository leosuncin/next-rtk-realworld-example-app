import type { PropsWithChildren } from 'react';

import Footer from '@app/components/footer';
import Navbar from '@app/components/navbar';

function Layout({ children }: PropsWithChildren<Record<string, unknown>>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
