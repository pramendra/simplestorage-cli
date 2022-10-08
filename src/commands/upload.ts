import type { Arguments, CommandBuilder } from 'yargs';
import path from 'path';
import fs from 'fs';
import cliProgress from 'cli-progress';

type Options = {
  path: string;
};
const CHUNK_SIZE = 1 * 1024 * 1024;

export const command: string = 'upload <path>';
export const desc: string = 'Upload file';
export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional('path', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  // create container for progress bars
  const multibar = new cliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: false,
    format: '[{bar}] {percentage}% | {transferred}/{length} bytes | {filename}',
  });

  try {
    const { path: p = './' } = argv;
    const isFile = fs.lstatSync(p).isFile();
    const filePath = isFile ? p : path.join(p);
    const file = path.basename(filePath);
    const { size } = fs.statSync(filePath);

    console.log(
      isFile,
      fs.lstatSync(path.join(p)).isFile(),
      size,
      filePath,
      file
    );
    const targetFile = `./files/${file}`;
    // create an upload progress bar for this file
    const bar = multibar.create(100, 0, {
      filename: filePath,
      transferred: 0,
      length: size,
    });

    const total = Math.ceil(size / CHUNK_SIZE);

    let chunkNumber = 0;
    let transferred = 0;

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(targetFile);
      const readStream = fs.createReadStream(filePath, {
        highWaterMark: CHUNK_SIZE,
      });

      readStream
        .on('data', async (chunk) => {
          // pause the stream while uploading
          readStream.pause();
          writeStream.write(chunk);
          const number = (chunkNumber + 1).toString();
          // parts.push({ eTag, number });

          chunkNumber++;
          transferred += chunk.length;

          // // update the progress bar
          bar.update((transferred / size) * 100, {
            filename: filePath,
            transferred: transferred,
            length: size,
          });

          // resume the stream to upload the next chunk
          readStream.resume();
        })
        .on('end', () => {
          resolve(null);
        })
        .on('error', reject);
    });
    multibar.stop();

    process.stdout.write(`\nSuccessfully uploaded: ${targetFile}\n`);
  } catch (error: any) {
    console.warn(error.toString());
  }
  process.exit(0);
};
