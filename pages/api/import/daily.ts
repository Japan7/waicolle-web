import fs from 'fs';
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

const TEST_FILE = './tests/waicolle_export_daily.json';
if (fs.existsSync(TEST_FILE)) IMPORTED_DAILY[0] = JSON.parse(fs.readFileSync(TEST_FILE, 'utf-8'));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  IMPORTED_DAILY[req.body.bot] = req.body;
  res.status(200).json({ id: req.body.bot });
}
