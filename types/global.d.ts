declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CHUNK_SIZE: number;
      NODE_ENV: 'development' | 'production';
    }
  }
}
export {};
