import { StatusCodes } from 'http-status-codes';
import type { NextApiHandler } from 'next';

import { getLogger } from '@/lib/log';

const handler: NextApiHandler = async (req, res) => {
  const logger = getLogger(req);

  logger.info({}, 'Hello World');
  res.status(StatusCodes.OK).end();
};

export default handler;
