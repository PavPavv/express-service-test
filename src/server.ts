import express from 'express';

const app = express();

app.get('/', (_req, res) => {
  res.send('It works!');
});

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`);
});