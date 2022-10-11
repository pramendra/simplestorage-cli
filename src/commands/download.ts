import type { Arguments, CommandBuilder } from 'yargs';
import path from 'path';
import chalk from 'chalk';
import {
  getFileInfo,
  getDecryptFilePath,
  findFileByID,
  UPLOAD_PATH,
} from '../utilities/file';
import { decrypt } from '../utilities/encryption';

type Options = {
  fileid: string;
  outdir: string;
};

export const command: string = 'download <fileid>';
export const desc: string = 'Download a file';

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
  const matchedSourceFileName = (await findFileByID(UPLOAD_PATH, fileid)) || '';
  await new Promise((resolve, reject) => {
    try {
      if (matchedSourceFileName === null) {
        reject();
      }
    } catch (error) {
      reject();
    }
    const { isFile, fileName, filePath } = getFileInfo(
      getDecryptFilePath([fileid, matchedSourceFileName].join('###'))
    );

    if (isFile === true) {
      try {
        const targetFile = path.join(outdir, matchedSourceFileName);
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
