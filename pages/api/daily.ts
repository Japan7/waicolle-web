import type { NextApiHandler } from "next";
import redis from "../../lib/redis";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb",
    },
  },
};

interface Data {
  id: number;
}

const handler: NextApiHandler<Data> = async (req, res) => {
  switch (req.method) {
    case "POST":
      await redis.HSET("daily", req.body.bot, JSON.stringify(req.body));
      res.status(200).json({ id: req.body.bot });
      break;

    default:
      res.status(405).end();
      break;
  }
};

export default handler;
