declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      CLIENT_PORT: string;
      SERVER_PORT: string;
      ENTRY_FILE_NAME: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
