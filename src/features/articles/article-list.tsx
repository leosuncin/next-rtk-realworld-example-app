import { useSelector } from '@app/app/hooks';
import ArticlePreview from '@app/features/articles/article-preview';
import ArticlesPagination from '@app/features/articles/articles-pagination';
import {
  selectAllArticles,
  selectIsLoading,
  selectIsSuccess,
} from '@app/features/articles/articles.slice';

function ArticleList() {
  const articles = useSelector(selectAllArticles);
  const isLoading = useSelector(selectIsLoading);
  const isSuccess = useSelector(selectIsSuccess);

  if (isLoading) {
    return (
      <div className="tab-content">
        <article className="article-preview">Loading articles...</article>
      </div>
    );
  }

  if (isSuccess && articles.length === 0) {
    return (
      <div className="tab-content">
        <article className="article-preview">
          No articles are here... yet.
        </article>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {articles.map((article) => (
        <ArticlePreview key={article.slug} article={article} />
      ))}

      <ArticlesPagination />
    </div>
  );
}

export default ArticleList;
