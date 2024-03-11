import express from "express";

import { AppDataSource } from "../data-source";
import { Content } from "../entities/Content";

const app: express.Express = express();

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept",);
    next();
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

AppDataSource.initialize()
  .then(() => {
    console.log("DB connected");
  })
  .catch((error: Error) => {
    console.error(error);
  });

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("コンテンツの一覧を表示します。");
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
