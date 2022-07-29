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
      const key = `wc:${req.body.bot}`;
      if (!(await redis.EXISTS(key))) {
        await redis.json.SET(key, "$", { waifus: req.body });
      } else {
        await redis.json.SET(key, ".waifus", req.body);
      }
      res.status(200).json({ id: req.body.bot });
      break;

    default:
      res.status(405).end();
      break;
  }
};

export default handler;
