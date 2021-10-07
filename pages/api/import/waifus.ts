import type { NextApiRequest, NextApiResponse } from 'next';
import { WCWaifus } from '../../../lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export const IMPORTED_WAIFUS: { [key: number]: WCWaifus } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  IMPORTED_WAIFUS[req.body.bot] = req.body;
  res.status(200).json({ id: req.body.bot });
}
