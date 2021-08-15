import NextLink from 'next/link';

import type { Article } from '@app/features/articles/articles-api';

export interface ArticlePreviewProps {
  article: Article;
}

function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <article className="article-preview">
      <div className="article-meta">
        <NextLink href={`/@${article.author.username}`}>
          <img
            src={
              article.author.image ??
              'https://static.productionready.io/images/smiley-cyrus.jpg'
            }
            alt={article.author.username}
          />
        </NextLink>

        <div className="info">
          <NextLink href={`/@${article.author.username}`}>
            <a className="author">{article.author.username}</a>
          </NextLink>
          <time className="date" dateTime={article.createdAt}>
            {new Date(article.createdAt).toDateString()}
          </time>
        </div>

        <div className="pull-xs-right">
          <button
            type="button"
            className={
              article.favorited
                ? 'btn btn-sm btn-primary'
                : 'btn btn-sm btn-outline-primary'
            }
          >
            <i className="ion-heart" /> {article.favoritesCount}
          </button>
        </div>
      </div>

      <NextLink href={`/article/${article.slug}`}>
        <a className="preview-link">
          <h1>{article.title}</h1>
          <p>{article.description}</p>
          <span>Read more...</span>
          <ul className="tag-list">
            {article.tagList.map((tag) => (
              <li key={tag} className="tag-default tag-pill tag-outline">
                {tag}
              </li>
            ))}
          </ul>
        </a>
      </NextLink>
    </article>
  );
}

export default ArticlePreview;
