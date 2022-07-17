const app = require('../src/app.js');
const newsRouter = require('../src/routes/news.js');

app.use(newsRouter.routes()); // /api or /api/news

module.exports = app;
