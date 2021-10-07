import type { NextApiRequest, NextApiResponse } from 'next';
import { WCPools } from '../../../lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export const IMPORTED_POOLS: { [key: number]: WCPools } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  IMPORTED_POOLS[req.body.bot] = req.body;
  res.status(200).json({ id: req.body.bot });
}
