import express from "express";

import { Content } from "./entities/Content";
import { AppDataSource } from "../data-source";

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
  .then(async () => {
    console.log("DB connected");
    const content = new Content("test title", "test body");
    await AppDataSource.manager.save(content);
    console.log(`コンテンツを保存しました。コンテンツidは${content.id}です。`);

    app.listen(3000, () => {
      console.log("App is running on port 3000");
    });
  })
  .catch((error: Error) => {
    console.error(error);
  });

app.get("/", async (req: express.Request, res: express.Response) => {
  const savedContentOfAll = await AppDataSource.manager.find(Content);
  res.json(savedContentOfAll);
});


