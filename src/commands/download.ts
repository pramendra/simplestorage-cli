import type { Arguments, CommandBuilder } from 'yargs';
import 'dotenv/config';
import { decrypt } from './../utilities/encryption';
import { getFileInfo, getTargerDownloadFilePath } from './../utilities/file';

type Options = {
  fileid: string;
};

const cryptPassword = process.env.ENCRYPT_KEY as string;

export const command: string = 'download <fileid>';
export const desc: string = 'download file';
export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional('fileid', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  await new Promise((resolve, reject) => {
    try {
      const { fileid: p = './' } = argv;
      const { isFile, fileName, filePath } = getFileInfo(p);
      if (isFile === true) {
        const targetFile = getTargerDownloadFilePath(fileName);

        decrypt({
          fileName: filePath,
          password: cryptPassword,
          targetFile,
        });

        process.stdout.write(`\nSuccessfully downloaded: ${targetFile}\n`);
      } else {
        process.stdout.write(`\nUnable to download\n`);
      }
    } catch (error: any) {
      console.warn(error.toString());
    }
  });

  process.exit(0);
};
