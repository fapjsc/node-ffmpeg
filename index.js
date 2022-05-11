// 聲音及視訊直接從 EGM 接出來

const ffmpeg = require("fluent-ffmpeg");
const colors = require("colors");
const { getIPAddress } = require("./helpers");

const ip = getIPAddress();

const outputPath = `rtmp://220.135.67.240/game/${ip.split(".").pop()}`;

let command = null;

//**  PI  */
command = ffmpeg()
  .input("/dev/video0")
  .inputOptions(["-thread_queue_size 4096", "-s 640x480"])
  // .addInput("plughw:CARD=MS2109,DEV=0")
  .addInput("plughw:2")
  .addOptions([
    "-c:v libx264",
    "-profile:v main",
    "-pix_fmt yuv420p",
    "-vf hue=b=2",
    "-g 20",
    "-af volume=10",
    "-b:v 700k",
    "-movflags faststart",
    "-tune zerolatency",
    "-preset ultrafast",
  ])

  .inputOption(["-f alsa", "-thread_queue_size 4096"])
  .addOptions(["-c:a aac", "-b:a 64k"])
  .format("flv")
  .output(outputPath)

  //** LISTEN */
  .on("start", function (commandLine) {
    console.log(
      `[  ${new Date()}  ] Vedio is Pushing To ${outputPath} !`.green
    );
    console.log(`commandLine:  + ${commandLine}`.blue);
  })
  .on("error", function (err, stdout, stderr) {
    console.log(`[  ${new Date()}  ] error:   + ${err.message}`.red.inverse);
  })
  .on("end", function () {
    console.log(
      `[  ${new Date()}  ] Vedio Pushing is Finished !`.yellow.inverse
    );
  });

command.run();
