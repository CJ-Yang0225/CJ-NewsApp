const app = require('./src/app.js');
const newsRouter = require('./src/routes/news.js');
require('dotenv').config();

const { PORT, HOSTNAME } = process.env;

app.use(newsRouter.routes());

app.listen(PORT, HOSTNAME, () => {
  console.log('Server is running on:', `${HOSTNAME}:${PORT}`);
});
