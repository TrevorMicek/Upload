import Fastify from "fastify";
import * as fs from "node:fs";
import path from "path";
import { pipeline } from "node:stream/promises";
import fastifyPlugin from "fastify-plugin";
import sharp from "sharp";

const upload = async (req, reply) => {
  const data = await req.file();

  const image = data.filename.split(".");
  const isImage = () => {
    if (data.mimetype.includes("image")) {
      return "images";
    } else {
      console.log("files here");
      return "files";
    }
  };
  const convert = (data) =>
    sharp(data)
      .webp()
      .toFile(`./src/data/${isImage()}/${image[0]}.webp`, (err, info) => {
        if (err) {
          console.error(err);
        } else {
          fs.unlink(data, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
          console.log("success", info);
        }
      });
  const fold = `./src/data/${isImage()}`;
  console.log(fold);
  const filepath = path.join(fold, data.filename);
  data.file;
  data.fields;
  data.fieldname;
  data.filename;
  data.encoding;
  data.mimetype;

  await pipeline(data.file, fs.createWriteStream(filepath));
  convert(filepath);
  reply.send();
};
export default fastifyPlugin(upload);
