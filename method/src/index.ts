import express from "express";

import { AppDataSource } from "../data-source";
import * as contentHandler from "../handlers/contents";

const app: express.Express = express();

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
    const contents = await contentHandler.getContents();
    if (contents == null) {
      res.status(404).send("コンテンツがありません");
      return;
    }
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/contents", async (req: express.Request, res: express.Response) => {
  try {
    const content = await contentHandler.postContents(
      req.body.title,
      req.body.body,
    );
    res.status(201).json(content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get(
  "/contents/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const content = await contentHandler.getContent(req.params.id);
      if (content == null) {
        res.status(404).send("コンテンツがありません");
        return;
      }
      res.status(200).json(content);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
);

app.put(
  "/contents/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const content = await contentHandler.putContent(
        req.params.id,
        req.body.title,
        req.body.body,
      );
      if (content == null) {
        res.status(404).send("コンテンツがありません");
        return;
      }
      res.status(200).json(content);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
);

app.delete(
  "/contents/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      const content = await contentHandler.deleteContent(req.params.id);
      if (content == null) {
        res.status(404).send("コンテンツがありません");
        return;
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  },
);

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
