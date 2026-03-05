import Fastify from "fastify";
import * as fs from "node:fs";
import path from "path";
import { pipeline } from "node:stream/promises";
import fastifyPlugin from "fastify-plugin";

const upload = async (req, reply) => {
  const data = await req.file();
  const fold = "./src/data";
  const filepath = path.join(fold, data.filename);
  data.file;
  data.fields;
  data.fieldname;
  data.filename;
  data.encoding;
  data.mimetype;

  await pipeline(data.file, fs.createWriteStream(filepath));
  reply.send();
};
export default fastifyPlugin(upload);
