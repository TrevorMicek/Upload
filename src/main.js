import Fastify from "fastify";
import upload from "./upload.js";
import fastifyPlugin from "fastify-plugin";
import multipart from "@fastify/multipart";
import cors from "@fastify/cors";
import fs from "fs";
import path from "path";
import staticFiles from "@fastify/static";
const fastify = Fastify({
  logger: true,
});
fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
fastify.register(cors, {
  origin: "http://localhost:4321",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
const dirname = import.meta.dirname;
fastify.register(staticFiles, {
  root: path.join(dirname, "./data/images"),
  prefix: "/data/images/",
});
fastify.register(staticFiles, {
  root: path.join(dirname, "./data"),
  prefix: "/data/files/",
  decorateReply: false,
});
fastify.get("/data/:type", function (request, reply) {
  const { type } = request.params;
  fs.readdir(path.join(dirname, `data/${type}`), (err, files) => {
    if (err) {
      console.error(err);
    } else {
      reply.status(200).send({ success: true, filenames: files });
      console.log(files);
    }
  });

  console.log("data sent");
});
fastify.post("/data/:folder/:fileName", function (request, reply) {
  console.log("deleting");
  if (!reply.status(200)) {
    console.log("error");
  } else {
    reply.status(200);
    console.log("delete");

    const { folder, fileName } = request.params;
    console.log(folder);
    fs.unlink(`./src/data/${folder}/${fileName}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File deleted successfully");
    });
  }
});
fastify.post("/upload", function (request, reply) {
  console.log("uploading");
  upload(request, reply);
  console.log("upload complete");
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
