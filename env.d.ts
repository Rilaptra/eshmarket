declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    ClientSecret: string;
    ClientID: number;
    ENCRYPTION_SECRET_KEY: string;
    NGROK_URL: string;
    DISCORD_TOKEN: string;
    DISCORD_WEBHOOK_URL: string;
  }
}
