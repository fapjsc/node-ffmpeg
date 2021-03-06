// 沒有聲音輸出的攝影機設備

const ffmpeg = require("fluent-ffmpeg");
const colors = require("colors");
const { getIPAddress } = require("./helpers");

const ip = getIPAddress();

const outputPath = `rtmp://220.135.67.240/game/${ip.split(".").pop()}`;

let command = null;

//**  PI  */
command = ffmpeg()
  .input("/dev/video0")
  .inputOptions("-s 800x600")
  // .addInput("plughw:CARD=MS2109,DEV=0")
  // .addInput("plughw:2")
  .addOptions([
    "-c:v libx264",
    "-profile:v main",
    "-pix_fmt yuv420p",
    "-g 20",
    "-b:v 700k",
    "-movflags faststart",
    "-tune zerolatency",
    "-preset veryfast",
    "-vf scale=800:750",
  ])
  .format("flv")
  .output(outputPath)
  // .inputOption("-f alsa")
  // .addOptions(["-c:a aac", "-b:a 64k"])

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
