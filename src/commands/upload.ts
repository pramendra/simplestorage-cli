import type { Arguments, CommandBuilder } from 'yargs';

type Options = {
  path: string;
};

export const command: string = 'upload <path>';
export const desc: string = 'Upload file';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional('path', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
  const { path } = argv;
  process.stdout.write(`${path}!`);
  process.exit(0);
};
