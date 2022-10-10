import crypto from 'crypto';
import zlib from 'zlib';
import path from 'path';
import fs from 'fs';
import { getCipher, getDecipher } from './cipher';
import AppendInitVect from './appendInitVect';

const CHUNK_SIZE = (
  Number.isInteger(process.env.CHUNK_SIZE)
    ? process.env.CHUNK_SIZE
    : 1 * 1024 * 1024
) as number;

interface EncryptionOptions {
  fileName: string;
  targetFile: string;
  password: string;
}

export const encrypt = async ({
  fileName,
  targetFile,
  password,
}: EncryptionOptions): Promise<any> => {
  return await new Promise((resolve, reject) => {
    try {
      const readStream = fs.createReadStream(fileName, {
        highWaterMark: CHUNK_SIZE,
      });
      // Create a write stream with a different file extension.
      const writeStream = fs.createWriteStream(path.join(targetFile));

      const initVect = crypto.randomBytes(16);

      const cipher = getCipher(password, initVect);

      const gzip = zlib.createGzip();

      const { size } = fs.statSync(fileName);
      const appendInitVect = new AppendInitVect(initVect, fileName, size);

      readStream
        .pipe(cipher)
        .pipe(gzip) //
        .pipe(appendInitVect)
        .pipe(writeStream);

      writeStream
        .on('finish', () => {
          resolve('done');
          writeStream.end();
        })
        .on('error', reject);
    } catch (error: any) {
      reject();
    }
  });
};

interface DecryptionOptions extends EncryptionOptions {}
export const decrypt = async ({
  fileName,
  password,
  targetFile,
}: DecryptionOptions): Promise<any> => {
  return await new Promise((resolve, reject) => {
    // First, get the initialization vector from the file.
    const readInitVect = fs.createReadStream(fileName, {
      end: 15,
    });

    let initVect: any;
    readInitVect.on('data', (chunk) => {
      initVect = chunk;
    });

    // Once we’ve got the initialization vector, we can decrypt the file.
    readInitVect.on('close', () => {
      const decipher = getDecipher(password, initVect);
      const unzip = zlib.createUnzip();

      const writeStream = fs.createWriteStream(targetFile);
      const readStream = fs.createReadStream(fileName, { start: 16 });
      // const appendInitVect = new AppendInitVect(initVect, size);

      readStream
        .pipe(unzip)
        // .pipe(appendInitVect)
        .pipe(decipher) //
        .pipe(writeStream);

      writeStream
        .on('finish', () => {
          resolve('done');
          writeStream.end();
        })
        .on('error', reject);
    });
  }).catch((error) => {
    console.log(error);
  });
};
