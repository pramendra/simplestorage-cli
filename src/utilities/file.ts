import path from 'path';
import fs from 'fs';
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
    console.warn('>>', error.toString());
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
  return `./${UPLOAD_PATH}/${uuid}`;
};

export const getDecryptFilePath = (fileName: string) => {
  return `./${UPLOAD_PATH}/${fileName}`;
};
