import NextLink from 'next/link';

import type { Article } from '@app/interfaces';

export interface ArticlePreviewProps {
  article: Article;
}

function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <article className="article-preview">
      <div className="article-meta">
        <NextLink href={`/@${article.author.username}`}>
          {article.author.image && <img src={article.author.image} />}
        </NextLink>

        <div className="info">
          <NextLink href={`/@${article.author.username}`}>
            <a className="author">{article.author.username}</a>
          </NextLink>
          <span className="date">
            {new Date(article.createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button
            className={
              article.favorited
                ? 'btn btn-sm btn-primary'
                : 'btn btn-sm btn-outline-primary'
            }
          >
            <i className="ion-heart"></i> {article.favoritesCount}
          </button>
        </div>
      </div>

      <NextLink href={`/article/${article.slug}`}>
        <a className="preview-link">
          <h1>{article.title}</h1>
          <p>{article.body}</p>
          <span>Read more...</span>
          <ul className="tag-list">
            {article.tagList.map((tag) => (
              <li className="tag-default tag-pill tag-outline" key={tag}>
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
