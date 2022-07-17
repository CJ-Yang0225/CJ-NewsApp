const Router = require('koa-router');
const { getNews } = require('../controllers/news.js');

const router = new Router();

router.prefix('/api')

router.get(['/', '/news'], getNews);

module.exports = router;
