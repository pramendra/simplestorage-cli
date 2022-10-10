import type { Arguments, CommandBuilder } from 'yargs';
import 'dotenv/config';
import chalk from 'chalk';
import { encrypt } from './../utilities/encryption';
import { getFileInfo, getEncryptFilePath, randomId } from './../utilities/file';
type Options = {
  path: string;
};

const cryptPassword = process.env.ENCRYPT_KEY as string;
export const command: string = 'upload <path>';
export const desc: string = 'Upload a file';
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

        const promise = encrypt({
          fileName: filePath,
          password: cryptPassword,
          targetFile,
        });

        promise.then(
          (result) => {
            if (result === 'done') {
              process.stdout.write(
                chalk.green(`\nSuccessfully uploaded: ${uuid}\n`)
              );
              resolve('done');
            }
          },
          (error) => {
            reject();
          }
        );
      } else {
        process.stdout.write(chalk.red(`\nUnable to upload: ${p}\n`));
        reject();
      }
    } catch (error: any) {
      process.stdout.write(chalk.red(`\nUnable to upload: ${p}\n`));
      reject();
    }
  });
  process.exit(0);
};
