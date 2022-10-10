import path from 'path';
import fs from 'fs';

interface GetInfoReturn {
  isFile: boolean;
  filePath: string;
  fileName: string;
}
export const getFileInfo = (p: string): GetInfoReturn => {
  const isFile = fs.lstatSync(p).isFile();
  const filePath = isFile ? p : path.join(p);
  const file = path.basename(filePath);
  return {
    isFile,
    filePath,
    fileName: file,
  };
};
