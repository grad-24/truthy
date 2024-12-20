import { ConnectionOptions } from 'typeorm';
import * as config from 'config';
const dbConfig = config.get('db');
const ormConfig: ConnectionOptions = {
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  // migrationsTransactionMode: 'each',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  logging: false,
  synchronize: true,
  // migrationsRun: process.env.NODE_ENV === 'test',
  dropSchema: process.env.NODE_ENV === 'test',
  // migrationsTableName: 'migrations',
  // migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
  // cli: {
  //   migrationsDir: 'src/database/migrations'
  // }
};

export = ormConfig;