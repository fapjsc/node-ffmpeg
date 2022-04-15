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
  .addInput("plughw:2")
  .addOptions([
    "-c:v libx264",
    "-profile:v main",
    "-pix_fmt yuv420p",
    "-vf hue=b=2",
    "-nr 1000",
    "-g 20",
    "-af volume=10",
    "-b:v 700k",
    "-movflags faststart",
    "-tune zerolatency",
    "-preset veryfast",
  ])

  .inputOption("-f alsa")
  .addOptions(["-c:a aac", "-b:a 64k"])
  .format("flv")
  .output(outputPath)

  //** LISTEN */
  .on("start", function (commandLine) {
    console.log(`[  ${new Date()}  ] Vedio is Pushing To ${outputPath} !`.green);
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
