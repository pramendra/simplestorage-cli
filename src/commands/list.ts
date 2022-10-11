import type { Arguments, CommandBuilder } from 'yargs';
import fs from 'fs';
import chalk from 'chalk';
import { UPLOAD_PATH } from './../utilities/file';

type Options = {};

export const command: string = 'list';
export const desc: string = 'Lists files';

export const builder: CommandBuilder<Options, Options> = (yargs) => yargs;

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  await new Promise((resolve, reject) => {
    const isDir = fs.lstatSync(UPLOAD_PATH).isDirectory();

    interface ListUploadedFileType {
      id: string;
      name: string;
    }
    let listUploadedFiles: ListUploadedFileType[] = [];
    if (isDir) {
      fs.readdir(UPLOAD_PATH, (err, files) => {
        if (err) {
          reject();
        }

        files.forEach((file: string) => {
          const [id, name] = file.split('###');
          listUploadedFiles.push({
            id,
            name,
          });
        });
        process.stdout.write(
          chalk.green(JSON.stringify(listUploadedFiles, null, 2), '\n')
        );

        resolve('done');
      });
    } else {
      reject();
    }
  }).then(
    (result) => {
      process.exit(0);
    },
    (error) => {
      process.stdout.write(chalk.red(`File(s) dont exits\n`));
    }
  );
  process.exit(0);
};
