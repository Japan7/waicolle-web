import type { NextApiRequest, NextApiResponse } from 'next';
import { WCItem } from '../../../lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export let WAICOLLAGE_DATA: WCItem[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  WAICOLLAGE_DATA = JSON.parse(req.body);
  res.status(200).json({ url: 'https://waicolle.yuru.moe/collage' });
}
