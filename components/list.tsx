import ListItem from '@app/components/list-item';
import { User } from '@app/interfaces';

type Props = {
  items: User[];
};

const List = ({ items }: Props) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
);

export default List;
