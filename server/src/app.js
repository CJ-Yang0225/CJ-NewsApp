const Koa = require('koa');
require('dotenv').config();
const newsRouter = require('./routes/news.js');

const { PORT, HOSTNAME } = process.env;
const app = new Koa();

app.use(newsRouter.routes());

app.listen(PORT, HOSTNAME, () => {
  console.log('Server is running on port:', PORT);
});
