import type { Arguments, CommandBuilder } from 'yargs';

type Options = {};

export const command: string = 'list';
export const desc: string = 'Lists files';

export const builder: CommandBuilder<Options, Options> = (yargs) => yargs;

export const handler = (argv: Arguments<Options>): void => {
  process.stdout.write(`list files`);
  process.exit(0);
};
