declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_VAR_ONE: string;
      VAR_ONE: string;

      DB_HOST: string;
      DB_PORT: number;
      DB_NAME: string;
      DB_USER: string;
      DB_PASSWORD: string;
    }
  }
}

export {};
