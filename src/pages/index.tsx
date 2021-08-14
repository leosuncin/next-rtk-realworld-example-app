import type { NextPage } from 'next';

import Layout from '@app/components/layout';
import ArticlesLayout from '@app/features/articles/articles-layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <ArticlesLayout />
    </Layout>
  );
};

export default Home;
