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
  const key = `wc:${req.body.bot}`;
  const path = "$.poolsData";
  await redis.json.SET(key, "$", {}, { NX: true });

  switch (req.method) {
    case "POST":
      await redis.json.SET(key, path, req.body);
      res.status(200).json({ id: req.body.bot });
      break;

    default:
      res.status(405).end();
      break;
  }
};

export default handler;
