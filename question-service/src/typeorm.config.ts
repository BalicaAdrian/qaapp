import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 3310,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'question_db',
    entities:  [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*.js'],
    synchronize: process.env.SYNCRONIZE ? process.env.SYNCRONIZE === 'true' : true,
    migrationsRun: true

};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;