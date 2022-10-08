import type { Arguments, CommandBuilder } from 'yargs';

type Options = {
  fileid: string;
};

export const command: string = 'delete <fileid>';
export const desc: string = 'Delete file';

export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.positional('fileid', { type: 'string', demandOption: true });

export const handler = (argv: Arguments<Options>): void => {
  const { fileid } = argv;
  process.stdout.write(`${fileid}!`);
  process.exit(0);
};
