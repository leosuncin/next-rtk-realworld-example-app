import faker from 'faker';
import { rest } from 'msw';

import type { TagsResponse } from '@app/features/tags/tags-api';

export const getAllHandler = rest.get<never, TagsResponse>(
  `${process.env.NEXT_PUBLIC_API_ROOT}/tags`,
  (_request, response, context) => {
    const tags = new Set(Array.from({ length: 10 }, () => faker.lorem.word()));

    return response(context.json({ tags: [...tags] }), context.delay());
  },
);
