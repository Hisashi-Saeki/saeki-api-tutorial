import *as dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST ?? "localhost",
  port: 3306,
  username: process.env.MYSQL_USERNAME ?? "docker",
  password: process.env.MYSQL_PASSWORD ?? "docker",
  database: "tutorial_db",
  charset: "utf8mb4",
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"]
})
