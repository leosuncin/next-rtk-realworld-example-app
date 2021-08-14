import ArticlePreview from '@app/features/articles/article-preview';
import ArticlesPagination from '@app/features/articles/articles-pagination';
import {
  selectAllArticles,
  selectIsLoading,
  selectIsSuccess,
} from '@app/features/articles/articles.slice';
import { useSelector } from '@app/store';

const ArticleList = () => {
  const articles = useSelector(selectAllArticles);
  const isLoading = useSelector(selectIsLoading);
  const isSuccess = useSelector(selectIsSuccess);

  if (isLoading) {
    return <div className="article-preview">Loading articles...</div>;
  }

  if (isSuccess && articles.length === 0) {
    return <div className="article-preview">No articles are here... yet.</div>;
  }

  return (
    <div className="tab-content">
      {articles.map((article) => (
        <ArticlePreview article={article} key={article.slug} />
      ))}

      <ArticlesPagination />
    </div>
  );
};

export default ArticleList;
