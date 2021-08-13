import NextLink from 'next/link';
import { useEffect } from 'react';

import { getAllTags, selectTags } from '@app/features/tags/tags.slice';
import { useDispatch, useSelector } from '@app/store';

interface TagPillProps {
  tag: string;
}

function TagPill({ tag }: TagPillProps) {
  return (
    <NextLink href={`/?tag=${encodeURIComponent(tag)}`}>
      <a className="tag-pill tag-default">{tag}</a>
    </NextLink>
  );
}

function Sidebar() {
  const dispatch = useDispatch();
  const tags = useSelector(selectTags);

  useEffect(() => {
    const promise = dispatch(getAllTags());

    return () => {
      promise.abort();
    };
  });

  return (
    <div className="sidebar">
      <p>Popular Tags</p>

      <div className="tag-list">
        {tags.length === 0 ? (
          <div>Loading tags...</div>
        ) : (
          tags.map((tag) => <TagPill key={tag} tag={tag} />)
        )}
      </div>
    </div>
  );
}

export default Sidebar;
