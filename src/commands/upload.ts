import type { Arguments, CommandBuilder } from 'yargs';
import 'dotenv/config';
import { encrypt } from './../utilities/encryption';
import { getFileInfo, getEncryptFilePath, randomId } from './../utilities/file';
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
  const uuid = randomId();
  await new Promise((resolve, reject) => {
    try {
      if (isFile) {
        const targetFile = getEncryptFilePath(fileName, uuid);
        encrypt({
          fileName: filePath,
          password: cryptPassword,
          targetFile,
        });
      } else {
        process.stdout.write(`\nUnable to upload\n`);
      }
    } catch (error: any) {
      console.warn(error.toString());
    }
  });
  process.exit(0);
};
