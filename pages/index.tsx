import { useRouter } from 'next/router';

import ArticlePagination from '@app/components/article-pagination';
import ArticlePreview from '@app/components/article-preview';
import Banner from '@app/components/banner';
import FeedHome from '@app/components/feed-home';
import Layout from '@app/components/layout';
import Sidebar from '@app/components/sidebar';
import type { Article } from '@app/interfaces';
import { useSelector } from '@app/store';
import { selectArticles } from '@app/store/slices/articles.slice';
import { getCurrentPage } from '@app/utils/query';

function Home() {
  const router = useRouter();
  const page = getCurrentPage(router.query);
  const articles: Article[] = useSelector(selectArticles({ page }));

  return (
    <Layout>
      <div className="home-page">
        <Banner />
        <main className="container page">
          <div className="row">
            <div className="col-md-9">
              <FeedHome />
              {articles.length === 0 ? (
                <div className="article-preview">
                  No articles are here... yet.
                </div>
              ) : (
                articles.map((article) => (
                  <ArticlePreview key={article.slug} article={article} />
                ))
              )}
              <ArticlePagination />
            </div>
            <div className="col-md-3">
              <Sidebar />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Home;
