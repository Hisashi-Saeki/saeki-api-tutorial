import express from 'express';
const app: express.Express = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
});

