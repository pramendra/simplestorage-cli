import type { Arguments, CommandBuilder } from 'yargs';
import 'dotenv/config';
import { encrypt } from './../utilities/encryption';
import { getFileInfo, getTargerUploadFilePath } from './../utilities/file';
type Options = {
  path: string;
};

const cryptPassword = process.env.ENCRYPT_KEY as string;
export const command: string = 'upload <path>';
export const desc: string = 'Upload file';
export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional('path', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { path: p = './' } = argv;
  const { isFile, fileName, filePath } = getFileInfo(p);
  await new Promise((resolve, reject) => {
    try {
      if (isFile) {
        const targetFile = getTargerUploadFilePath(fileName);
        encrypt({
          fileName: filePath,
          password: cryptPassword,
          targetFile,
        });
        process.stdout.write(`\nSuccessfully uploaded: ${targetFile}\n`);
      } else {
        process.stdout.write(`\nUnable to upload\n`);
      }
    } catch (error: any) {
      console.warn(error.toString());
    }
  });

  process.exit(0);
};
