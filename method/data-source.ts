import *as dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "docker",
  password: process.env.MYSQL_PASSWORD,
  database: "tutorial_db",
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"]
})
