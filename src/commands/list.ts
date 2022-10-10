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
    if (isDir) {
      fs.readdir(UPLOAD_PATH, (err, files) => {
        if (err) {
          return console.log('files dont exits: ' + err);
        }

        files.forEach((file: string, index: number) => {
          const colorLine = index % 2 ? chalk.green.inverse : chalk.green;
          process.stdout.write(colorLine(`${index + 1}. `, file, '\n'));
        });

        process.stdout.write(chalk.white.inverse('\n\n'));
      });
    } else {
      process.stdout.write(`files dont exits`);
    }
  });
  process.stdout.write(`list files`);
  process.exit(0);
};
