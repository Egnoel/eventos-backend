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
    mediaroot: "./media",
  },
  trans: {
    ffmpeg: "C:/ffmpeg/bin/ffmpeg.exe",
    tasks: [],
  },
};

const nms = new NodeMediaServer(config);
const createStream = (eventId) => ({
  app: "live",
  mode: "static",
  edge: `rtmp://localhost/live/${eventId}`,
  hls: true,
  hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]",
  dash: true,
  dashFlags: "[f=dash:window_size=3:extra_window_size=5]",
});
nms.on("prePublish", (id, StreamPath, args) => {
  // Verifique se o evento está começando com /live/
  if (StreamPath.startsWith("/live/")) {
    // Obtenha o ID do evento a partir do StreamPath
    const eventId = StreamPath.slice(6); // Remove os primeiros 6 caracteres (/live/)

    // Crie um novo fluxo com base no ID do evento e adicione-o às tarefas de transmissão
    config.trans.tasks.push(createStream(eventId));
  }
});
nms.run();
export default nms;
