import type { NextApiRequest, NextApiResponse } from 'next';
import { WCCharaData, WCItem } from '../../../lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export const WAICOLLAGE_DATA: { [key: number]: WCItem[] } = {};
export const DAILY_DATA: { [key: number]: WCCharaData[] } = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  WAICOLLAGE_DATA[req.body.bot] = req.body.data;
  DAILY_DATA[req.body.bot] = req.body.daily;
  res.status(200).json({ id: req.body.bot });
}
