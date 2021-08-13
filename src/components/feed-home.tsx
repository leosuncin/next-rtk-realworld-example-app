import { MouseEventHandler, useState } from 'react';

import { useSelector } from '@app/store';
import { selectUser } from '@app/store/slices/auth.slice';

type Feed = 'global' | 'personal';

function FeedHome() {
  const currentUser = useSelector(selectUser);
  const [currentFeed, setCurrentFeed] = useState<Feed>(
    currentUser ? 'personal' : 'global',
  );

  function onSwitchFeed(feed: Feed): MouseEventHandler<HTMLAnchorElement> {
    return (event) => {
      event.preventDefault();
      setCurrentFeed(feed);
    };
  }

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active">
        {currentUser && (
          <li className="nav-item">
            <a
              className={`nav-link${currentUser ? '' : ' disabled'}${
                currentFeed === 'global' ? ' active' : ''
              }`}
              href="#"
              onClick={onSwitchFeed('personal')}
            >
              Your Feed
            </a>
          </li>
        )}
        <li className="nav-item">
          <a
            className={`nav-link${currentFeed === 'global' ? ' active' : ''}`}
            href="#"
            onClick={onSwitchFeed('global')}
          >
            Global Feed
          </a>
        </li>
      </ul>
    </div>
  );
}

export default FeedHome;
