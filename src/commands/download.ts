import type { Arguments, CommandBuilder } from 'yargs';
import path from 'path';
import { getFileInfo, getDecryptFilePath } from './../utilities/file';
import { decrypt } from './../utilities/encryption';

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

        decrypt({
          fileName: filePath,
          password: cryptPassword,
          targetFile,
        });

        process.stdout.write(`${fileid} downloaded successfully`);
      } catch (error: any) {
        console.warn(error.toString());
        process.stdout.write(`Unable to download ${fileid}!`);
      }
    } else {
      process.stdout.write(`Unable to download ${fileid}!`);
    }
  });

  process.exit(0);
};
