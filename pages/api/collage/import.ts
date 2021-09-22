import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { WCData } from '../../../lib/types';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
};

export const WAICOLLE_DATA: { [key: number]: WCData } = {};

const TEST_FILE = './tests/waicolle_export.json';
if (fs.existsSync(TEST_FILE)) WAICOLLE_DATA[0] = JSON.parse(fs.readFileSync(TEST_FILE, 'utf-8'));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  WAICOLLE_DATA[req.body.bot] = req.body;
  res.status(200).json({ id: req.body.bot });
}
