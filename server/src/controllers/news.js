const request = require('../config');

const getSpecificNews = async (ctx, next) => {
  const { method, query: params } = ctx;
  try {
    const news = await request(method, params);
    ctx.body = news; // ctx.response.body = news;
  } catch (error) {
    ctx.body = error;
  }
};

module.exports = {
  getSpecificNews,
};
