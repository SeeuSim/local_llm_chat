import { getLogger } from '@/lib/log';

const PATH = 'api/embed/documents';

export default async function POST(req: Request) {
  const logger = getLogger(req);

  return Response.json({ status: 200, message: 'OK' });
}
