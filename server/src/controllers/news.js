const request = require('../config');

const getNews = async (ctx) => {
  const { method, query: params } = ctx;
  try {
    const news = await request(method, params);
    ctx.body = news; // ctx.response.body = news;
  } catch (error) {
    if (error.response) {
      const { status, statusText, data } = error.response;
      ctx.status = status;
      ctx.body = { status, statusText, message: data.message || data };
    } else {
      ctx.body = { message: error.message };
    }
  }
};

module.exports = {
  getNews,
};
