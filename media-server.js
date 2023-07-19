import NodeMediaServer from "node-media-server";

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 60,
    ping_timeout: 30,
  },
  http: {
    port: 8080,
    allow_origin: "*",
    mediaPath: "./media",
  },
};

const nms = new NodeMediaServer(config);
nms.run();
export default nms;
