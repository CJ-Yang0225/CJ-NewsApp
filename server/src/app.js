const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

app.use(
  router
    .get('/', (ctx) => {
      ctx.type = 'html';
      ctx.body = "Hello I'm a proxy server. <a href='/api'>Get news json</a>";
    })
    .routes()
);

module.exports = app;
