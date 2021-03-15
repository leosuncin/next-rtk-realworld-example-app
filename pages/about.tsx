import Layout from 'components/layout';
import type { NextPage } from 'next';
import NextLink from 'next/link';

const AboutPage: NextPage = () => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <NextLink href="/">
        <a>Go home</a>
      </NextLink>
    </p>
  </Layout>
);

export default AboutPage;
