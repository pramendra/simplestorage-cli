import crypto, { Cipher, BinaryLike, randomUUID } from 'crypto';

export const uuid = () => randomUUID();
export function getCipherKey(password: string) {
  return crypto.createHash('sha256').update(password).digest();
}
export const getCipher = (password: string, vect: BinaryLike): Cipher => {
  const CIPHER_KEY = getCipherKey(password);
  const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, vect);
  return cipher;
};

export const getDecipher = (password: string, vect: BinaryLike): Cipher => {
  const cipherKey = getCipherKey(password);
  const decipher = crypto.createDecipheriv('aes256', cipherKey, vect);
  return decipher;
};
