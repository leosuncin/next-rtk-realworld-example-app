import Layout from 'components/layout';
import List from 'components/list';
import { User } from 'interfaces';
import type { GetStaticProps, NextPage } from 'next';
import NextLink from 'next/link';
import { sampleUserData } from 'utils/sample-data';

type Props = {
  items: User[];
};

const WithStaticProps: NextPage<Props> = ({ items }) => (
  <Layout title="Users List | Next.js + TypeScript Example">
    <h1>Users List</h1>
    <p>
      Example fetching data from inside <code>getStaticProps()</code>.
    </p>
    <p>You are currently on: /users</p>
    <List items={items} />
    <p>
      <NextLink href="/">
        <a>Go home</a>
      </NextLink>
    </p>
  </Layout>
);

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Example for including static props in a Next.js function component page.
  // Don't forget to include the respective types for any props passed into
  // the component.
  const items: User[] = sampleUserData;
  return { props: { items } };
};

export default WithStaticProps;
