const express = require("express");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

const M3U8_URL = "https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8";

app.get("/", (req, res) => {
  res.send("Relay Running");
});

app.get("/radio.mp3", (req, res) => {
  res.setHeader("Content-Type", "audio/mpeg");

  console.log("Incoming stream request...");

  const ffmpeg = spawn("ffmpeg", [
    "-loglevel", "debug",
    "-reconnect", "1",
    "-reconnect_streamed", "1",
    "-reconnect_delay_max", "5",
    "-i", M3U8_URL,
    "-vn",
    "-acodec", "libmp3lame",
    "-b:a", "128k",
    "-f", "mp3",
    "pipe:1"
  ]);

  ffmpeg.stdout.pipe(res);

  ffmpeg.stderr.on("data", data => {
    console.log(data.toString());
  });

  ffmpeg.on("close", code => {
    console.log("FFmpeg exited with code:", code);
  });

  req.on("close", () => {
    ffmpeg.kill("SIGINT");
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});