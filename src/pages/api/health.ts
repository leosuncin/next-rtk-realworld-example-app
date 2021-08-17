import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import connect from 'next-connect';

import { databaseMiddleware } from '@app/common/database.middleware';
import { errorMiddleware } from '@app/common/error.middleware';

async function healthCheckHandler(
  _: NextApiRequest,
  response: NextApiResponse,
) {
  response.json({
    status: 'ok',
    db: mongoose.STATES[mongoose.connection.readyState],
  });
}

export default connect({ onError: errorMiddleware })
  .use(databaseMiddleware)
  .get(healthCheckHandler);
