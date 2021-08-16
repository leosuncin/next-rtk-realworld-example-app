import NextLink from 'next/link';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@app/app/hooks';
import {
  getAllTags,
  selectIsLoading,
  selectTags,
} from '@app/features/tags/tags.slice';

type TagPillProps = {
  tag: string;
};

function TagPill({ tag }: TagPillProps) {
  return (
    <NextLink href={`/?tag=${encodeURIComponent(tag)}`}>
      <a className="tag-pill tag-default">{tag}</a>
    </NextLink>
  );
}

function TagsSidebar() {
  const dispatch = useDispatch();
  const tags = useSelector(selectTags);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    const fetchTags = dispatch(getAllTags());

    return () => {
      fetchTags.abort();
    };
  }, [dispatch]);

  return (
    <div className="sidebar">
      <p>Popular Tags</p>

      <div className="tag-list">
        {isLoading ? (
          <p>Loading Tags...</p>
        ) : (
          tags.map((tag) => <TagPill key={tag} tag={tag} />)
        )}
      </div>
    </div>
  );
}

export default TagsSidebar;
