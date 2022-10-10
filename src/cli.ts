#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const NODE_ENV: string = process.env.NODE_ENV as string;
yargs(hideBin(process.argv))
  .commandDir('commands', {
    exclude: /\.tests\./gm,
    extensions: [NODE_ENV === 'production' ? 'js' : 'ts'],
  })
  .strict()
  .alias({ h: 'help' }).argv;
