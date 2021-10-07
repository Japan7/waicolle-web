import fs from 'fs';
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

const TEST_FILE = './tests/waicolle_export_pools.json';
if (fs.existsSync(TEST_FILE)) IMPORTED_POOLS[0] = JSON.parse(fs.readFileSync(TEST_FILE, 'utf-8'));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  IMPORTED_POOLS[req.body.bot] = req.body;
  res.status(200).json({ id: req.body.bot });
}
