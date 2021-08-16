import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@app/app/hooks';
import { getCurrentPage } from '@app/common/utils';
import {
  getAllArticles,
  selectArticlesCount,
  selectArticlesPerPage,
} from '@app/features/articles/articles.slice';

function ArticlesPagination() {
  const dispatch = useDispatch();
  const router = useRouter();
  const articlesCount = useSelector(selectArticlesCount);
  const articlesPerPage = useSelector(selectArticlesPerPage);
  const currentPage = getCurrentPage(router.query);

  useEffect(() => {
    const fetchArticles = dispatch(getAllArticles({ page: currentPage - 1 }));

    return () => {
      fetchArticles.abort();
    };
  }, [router, dispatch, currentPage]);

  if (articlesCount <= articlesPerPage) {
    return null;
  }

  const pages = Array.from(
    { length: Math.ceil(articlesCount / articlesPerPage) },
    (_, number) => number + 1,
  );

  return (
    <nav>
      <ul className="pagination">
        {pages.map((page) => {
          const isActivePage = page === currentPage;

          return (
            <li
              key={page}
              className={isActivePage ? 'page-item active' : 'page-item'}
            >
              <NextLink href={`/?page=${page}`}>
                <a className="page-link">
                  {page
                    .toString()
                    .padStart(pages.length.toString().length, '0')}
                </a>
              </NextLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default ArticlesPagination;
