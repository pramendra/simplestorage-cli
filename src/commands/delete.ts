import type { Arguments, CommandBuilder } from 'yargs';
import fs from 'fs';
import chalk from 'chalk';
import { getFileInfo, getDecryptFilePath } from '../utilities/file';

type Options = {
  fileid: string;
};

export const command: string = 'delete <fileid>';
export const desc: string = 'Delete a file';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional('fileid', { type: 'string', demandOption: true });

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { fileid } = argv;

  await new Promise((resolve, reject) => {
    const {
      //
      isFile,
      filePath,
    } = getFileInfo(getDecryptFilePath(fileid));

    if (isFile) {
      try {
        fs.unlinkSync(filePath);
        process.stdout.write(chalk.red(`${fileid} deleted successfully\n`));
        resolve('done');
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
      process.stdout.write(chalk.red(`Unable to delete ${fileid}!\n`));
    }
  );

  process.exit(0);
};
