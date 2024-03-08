import express from 'express';
const app: express.Express = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('コンテンツの一覧を表示します。');
});

app.listen(3000, () => {
  console.log('App is running on port 3000');
})