import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import {
  getAllArticles,
  selectArticlesCount,
} from '@app/features/articles/articles.slice';
import { useDispatch, useSelector } from '@app/store';
import { getCurrentPage } from '@app/utils/query';

function ArticlePagination() {
  const dispatch = useDispatch();
  const articlesCount = useSelector(selectArticlesCount);
  const router = useRouter();
  const currentPage = getCurrentPage(router.query);

  useEffect(() => {
    const promise = dispatch(getAllArticles({ page: currentPage }));

    return () => {
      promise.abort();
    };
  }, [router]);

  if (articlesCount <= 10) return null;

  const pages = [...Array.from({ length: articlesCount / 10 }).keys()].map(
    (page) => page + 1,
  );

  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => (
          <li
            className={
              page === currentPage - 1 ? 'page-item active' : 'page-item'
            }
            key={page}
          >
            <NextLink href={`/?page=${page}`}>
              <a className="page-link">
                {page.toString().padStart(pages.length.toString().length, '0')}
              </a>
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default ArticlePagination;
