export const config = {
  db: {
    type: process.env.DB_TYPE || 'mysql',
    synchronize: true,
    logging: true,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '12345678',
    database: process.env.DB_NAME || 'nest',
    extra: {
      connectionLimit: 10,
    },
    autoLoadEntities: true,
  },
  foo: 'dev-bar',
};