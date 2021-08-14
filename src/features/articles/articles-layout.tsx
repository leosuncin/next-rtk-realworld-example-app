import Sidebar from '@app/components/sidebar';
import ArticleList from '@app/features/articles/article-list';
import Banner from '@app/features/articles/banner';
import FeedTabs, { FeedTabsProps } from '@app/features/articles/feed-tabs';
import { selectIsAuthenticated } from '@app/features/auth/auth.slice';
import { useSelector } from '@app/store';

const ArticlesLayout = ({ tab, tag }: FeedTabsProps) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="home-page">
      {isAuthenticated && <Banner />}

      <main className="container page">
        <div className="row">
          <div className="col-md-9">
            <FeedTabs tab={tab} tag={tag} />

            <ArticleList />
          </div>

          <div className="col-md-3">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticlesLayout;
