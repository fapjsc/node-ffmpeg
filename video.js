// 影片

const ffmpeg = require("fluent-ffmpeg");
const colors = require("colors");

const outputPath = `rtmp://220.135.67.240/jp/jp-1`;

let command = null;

//**  PI  */
command = ffmpeg()
  .input("/home/pi/Downloads/jackpot.mp4")
  .inputOptions(["-re", "-stream_loop -1"])
  .addOptions([
    "-c:v h264_omx",
    "-acodec aac",
    "-vf scale=800:600",
    "-preset slow",
    "-crf 18",
    "-b:v 2200k",
  ])
  .format("flv")
  .output(outputPath)

  //** LISTEN */
  .on("start", function (commandLine) {
    console.log(`[  ${new Date()}  ] Vedio is Pushing !`.green);
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
