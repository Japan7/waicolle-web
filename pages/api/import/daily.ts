import type { NextApiRequest, NextApiResponse } from 'next';
import { WCDaily } from '../../../lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export const IMPORTED_DAILY: { [key: number]: WCDaily } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  IMPORTED_DAILY[req.body.bot] = req.body;
  res.status(200).json({ id: req.body.bot });
}
