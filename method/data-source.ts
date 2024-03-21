import *as dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 33060,
  username: "docker",
  password: process.env.MYSQL_PASSWORD,
  database: "tutorial_db",
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"]
})
