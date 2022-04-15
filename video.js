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
    console.log(`error:   + ${err.message}`.red.inverse);
  })
  .on("end", function () {
    console.log(
      `[  ${new Date()}  ] Vedio Pushing is Finished !`.yellow.inverse
    );
  })
  .on('progress', function(progress) {
    console.log('Processing: ' + progress.timemark + '時間戳');
    console.log('Processing: ' + progress.frames + '總處理幀數');
    console.log('Processing: ' + progress.currentFps + '當前處理的幀率');
    console.log('Processing: ' + progress.currentKbps + '當前處理的吞吐量');
    console.log('Processing: ' + progress.currentKbps + '當前處理的吞吐量');
  });

command.run();
