declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      CLIENT_PORT: string;
      SERVER_PORT: string;
      FILE_NAME: string;
      NODE_ENV: "development" | "production" | "test";
      API_PROFIX: string;
      DEST: string;
      CLIENT_DEST: string;
    }
  }
}

export {};
