import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';

export function errorMiddleware(
  error: unknown,
  _: NextApiRequest,
  response: NextApiResponse,
) {
  let statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  let message = 'Error';

  if (error instanceof Error) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = error.message;
  }

  response.status(statusCode).json({ message, statusCode });
}
