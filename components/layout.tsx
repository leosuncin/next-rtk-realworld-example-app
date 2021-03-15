import NextHead from 'next/head';
import NextLink from 'next/link';
import type { PropsWithChildren } from 'react';

type Props = {
  title?: string;
};

const Layout = ({
  children,
  title = 'This is the default title',
}: PropsWithChildren<Props>) => (
  <div>
    <NextHead>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </NextHead>
    <header>
      <nav>
        <NextLink href="/">
          <a>Home</a>
        </NextLink>{' '}
        |{' '}
        <NextLink href="/about">
          <a>About</a>
        </NextLink>{' '}
        |{' '}
        <NextLink href="/users">
          <a>Users List</a>
        </NextLink>{' '}
        | <a href="/api/users">Users API</a>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>I'm here to stay (Footer)</span>
    </footer>
  </div>
);

export default Layout;
