import mongoose from "mongoose";

interface IDatabaseConfig {
  host: string;
  database: string;
  port: number | string;
  options: mongoose.ConnectionOptions;
}

interface IAppConfig {
  serverPort: string;
  databaseConfig: IDatabaseConfig;
  priceEngineBaseUrl: string;
}

export default Object.freeze({
  serverPort: process.env.PORT || '3000',
  databaseConfig: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  priceEngineBaseUrl: process.env.PRICE_ENGINE_BASE_URL
} as IAppConfig);
