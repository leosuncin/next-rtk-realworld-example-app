import Layout from 'components/layout';
import type { NextPage } from 'next';
import NextLink from 'next/link';

const IndexPage: NextPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <NextLink href="/about">
        <a>About</a>
      </NextLink>
    </p>
  </Layout>
);

export default IndexPage;
