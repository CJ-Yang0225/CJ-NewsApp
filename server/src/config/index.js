const axios = require('axios');
const { resolve } = require('path');
require('dotenv').config({ path: resolve(process.cwd(), '.env.local') });

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=tw';

const instance = axios.create({
  baseURL: NEWS_API_URL,
  headers: { 'X-Api-Key': process.env.NEWS_API_KEY },
});

async function request(method, params, config) {
  const result = await instance.request({ method, params, ...config });
  const data = result.data;

  return data;
}

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('News API Error:', error);
    if (error.response.status === 429) {
      instance.defaults.headers['X-Api-Key'] = process.env.NEWS_API_KEY2;
    }

    return Promise.reject(error);
  }
);

module.exports = request;
