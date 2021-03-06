import NextLink from 'next/link';

import { User } from '@app/interfaces';

type Props = {
  data: User;
};

const ListItem = ({ data }: Props) => (
  <NextLink href="/users/[id]" as={`/users/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </NextLink>
);

export default ListItem;
