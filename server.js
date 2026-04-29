const express = require("express");
const { spawn } = require("child_process");

const app = express();
const PORT = process.env.PORT || 8080;

const M3U8_URL = "https://servidor19.brlogic.com:7002/live";

app.get("/", (req, res) => {
  res.send("Relay Running");
});

app.get("/radio.mp3", (req, res) => {
  res.setHeader("Content-Type", "audio/mpeg");

  const ffmpeg = spawn("ffmpeg", [
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

  req.on("close", () => {
    ffmpeg.kill("SIGINT");
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on ${PORT}`);
});