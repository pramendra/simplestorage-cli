import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { uuid } from './../utilities/cipher';

interface GetInfoReturn {
  isFile: boolean;
  filePath: string;
  fileName: string;
}
export const getFileInfo = (p: string): GetInfoReturn => {
  let isFile = false;
  try {
    isFile = fs.lstatSync(p).isFile();
    const filePath = isFile ? p : path.join(p);
    const file = path.basename(filePath);

    return {
      isFile,
      filePath,
      fileName: file,
    };
  } catch (error: any) {
    process.stdout.write(chalk.red(`\nUnable to find: ${path.basename(p)}\n`));
  }

  return {
    isFile,
    filePath: '',
    fileName: '',
  };
};

export const UPLOAD_PATH = 'files';
export const randomId = () => uuid();
export const getEncryptFilePath = (fileName: string, uuid: string) => {
  return path.join(
    __dirname,
    '../../',
    UPLOAD_PATH,
    [uuid, fileName].join('###')
  );
};

export const getDecryptFilePath = (fileName: string) => {
  return path.join(__dirname, '../../', UPLOAD_PATH, fileName);
};

export const findFileByID = async (dirPath: string, id: string) => {
  let returnMatchedName: string | null = null;
  try {
    const isDir = fs.lstatSync(dirPath).isDirectory();
    if (isDir) {
      fs.readdirSync(dirPath).filter((file) => {
        const [fileid, name] = file.split('###');
        if (fileid === id) {
          returnMatchedName = name;
          return true;
        } else {
          return false;
        }
      });
    }
  } catch (error) {
    console.warn(error);
  }
  return returnMatchedName;
};
