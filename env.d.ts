declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    ClientSecret: string;
    ClientID: number;
    ENCRYPTION_SECRET_KEY: string;
  }
}
