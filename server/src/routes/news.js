const Router = require('koa-router');
const { getSpecificNews } = require('../controllers/news.js');

const router = new Router();

router.prefix('/api')

router.get(['/', '/news'], getSpecificNews);

module.exports = router;
