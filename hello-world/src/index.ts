import express from "express";
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

app.get("/", (req: express.Request, res: express.Response) => {
  console.log("test");
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
