import { useSelector } from '@app/app/hooks';
import type { Tab } from '@app/features/articles/articles.slice';
import { selectIsAuthenticated } from '@app/features/auth/auth.slice';

export type FeedTabsProps = {
  tab?: Tab;
  tag?: string;
};

function FeedTabs({ tab, tag }: FeedTabsProps) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="feed-toggle">
      <ul className="nav nav-pills outline-active" role="tablist">
        {isAuthenticated && (
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link${tab === 'feed' ? ' active' : ''}`}
              role="tab"
            >
              Your Feed
            </a>
          </li>
        )}
        <li className="nav-item" role="presentation">
          <a className={`nav-link${tab === 'all' ? ' active' : ''}`} role="tab">
            Global Feed
          </a>
        </li>
        {tag && (
          <li className="nav-item" role="presentation">
            <a className="nav-link active" role="tab">
              <i className="ion-pound" /> {tag}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default FeedTabs;
