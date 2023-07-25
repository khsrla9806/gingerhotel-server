// import * as dotenv from 'dotenv';
// dotenv.config();

export const config: any = {
  db_host: process.env.DB_HOST,
  db_port: process.env.PORT,
  db_user_name: process.env.DB_USER,
  db_password: process.env.DB_PASS,
  db_name: process.env.DB_NAME,
};

console.log(config);
