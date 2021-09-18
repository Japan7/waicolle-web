import type { NextApiRequest, NextApiResponse } from 'next';
import { WCItem } from '../../../lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export const WAICOLLAGE_DATA: { [key: number]: WCItem[] } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  WAICOLLAGE_DATA[req.body.bot] = req.body.data;
  res.status(200).json({ url: 'https://waicolle.yuru.moe/collage/' + req.body.bot });
}
