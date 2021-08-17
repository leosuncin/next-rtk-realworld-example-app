import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextHandler } from 'next-connect';

import { connectDB } from '@app/app/db';

export async function databaseMiddleware(
  _: NextApiRequest,
  __: NextApiResponse,
  next: NextHandler,
) {
  try {
    await connectDB(process.env.MONGO_URL);

    next();
  } catch (error: unknown) {
    next(error);
  }
}
