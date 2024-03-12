import express from "express";

import { Content } from "./entities/Content";
import { AppDataSource } from "../data-source";

const app: express.Express = express();
// 名前で判断しやすい。Entity Managerだと、引数を見るまで何のEntityを操作しているのかがわかりにくい。
const contentRepository = AppDataSource.getRepository(Content);


app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
  },
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/contents", async (req: express.Request, res: express.Response) => {
  try {
    const contentOfAll = await contentRepository.find();
    if(contentOfAll == null) {
      res.status(404).send("コンテンツがありません");
      return;
    }
    res.json(contentOfAll);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/contents", async (req: express.Request, res: express.Response) => {
  try {
    const content = new Content(req.body.title, req.body.body);
    await contentRepository.save(content);
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/contents/:id", async (req: express.Request, res: express.Response) => {
  try {
    const content = await contentRepository.findOne({
      where: {id: Number(req.params.id)},
    });
    if(content == null) {
      res.status(404).send("コンテンツがありません");
      return;
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})

app.put("/contents/:id", async (req: express.Request, res: express.Response) => {
  try {
    const content = await contentRepository.findOne({
      where: {id: Number(req.params.id)},
    });
    if (content == null) {
      res.status(404).send("コンテンツがありません");
      return;
    } else {
      content.title = req.body.title;
      content.body = req.body.body;
      await contentRepository.save(content);
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/contents/:id", async (req: express.Request, res: express.Response) => {
  try {
      const content = await contentRepository.findOne({
      where: {id: Number(req.params.id)},
    });
    if (content) {
      await contentRepository.remove(content);
    }
    res.json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

AppDataSource.initialize()
  .then(async () => {
    console.log("DB connected");

    app.listen(3000, () => {
      console.log("App is running on port 3000");
    });
  })
  .catch((err: Error) => {
    console.error(err);
  });

 