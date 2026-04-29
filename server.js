const express = require("express");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

const M3U8_URL = "https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8";

app.get("/radio.mp3", (req, res) => {
  res.setHeader("Content-Type", "audio/mpeg");

  const ffmpeg = spawn("ffmpeg", [
    "-reconnect","1",
    "-reconnect_streamed","1",
    "-reconnect_delay_max","5",
    "-i", M3U8_URL,
    "-vn",
    "-acodec","libmp3lame",
    "-b:a","128k",
    "-f","mp3",
    "pipe:1"
  ]);

  ffmpeg.stdout.pipe(res);

  req.on("close", () => ffmpeg.kill("SIGINT"));
});

app.listen(PORT);