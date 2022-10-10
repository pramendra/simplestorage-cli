import type { Arguments, CommandBuilder } from 'yargs';
import path from 'path';
import chalk from 'chalk';
import { getFileInfo, getDecryptFilePath } from '../utilities/file';
import { decrypt } from '../utilities/encryption';

type Options = {
  fileid: string;
  outdir: string;
};

export const command: string = 'download <fileid>';
export const desc: string = 'Download file';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    .positional('fileid', { type: 'string', demandOption: true }) //
    .options({
      outdir: {
        type: 'string',
        describe: 'output dir',
        demandOption: false,
        default: './',
        alias: 'out',
      },
    });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { fileid, outdir } = argv;

  await new Promise((resolve, reject) => {
    const { isFile, fileName, filePath } = getFileInfo(
      getDecryptFilePath(fileid)
    );

    if (isFile) {
      try {
        const targetFile = path.join(outdir, fileName);
        const cryptPassword = process.env.ENCRYPT_KEY as string;

        const promise = decrypt({
          fileName: filePath,
          password: cryptPassword,
          targetFile,
        });

        promise.then(
          (result) => {
            if (result === 'done') {
              process.stdout.write(
                chalk.green(`${fileid} downloaded successfully\n`)
              );
              resolve('done');
            }
          },
          (error) => {
            reject();
          }
        );
      } catch (error: any) {
        reject();
      }
    } else {
      reject();
    }
  }).then(
    (result) => {
      process.exit(0);
    },
    (error) => {
      process.stdout.write(chalk.red(`Unable to download ${fileid}!\n`));
    }
  );

  process.exit(0);
};
