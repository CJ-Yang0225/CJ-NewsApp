const Router = require('koa-router');
const { getSpecificNews } = require('../controllers/news.js');

const router = new Router();

router.get(['/', '/news'], getSpecificNews);

module.exports = router;
