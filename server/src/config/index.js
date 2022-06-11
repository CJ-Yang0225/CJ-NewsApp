const axios = require('axios');
const { resolve } = require('path');
require('dotenv').config({ path: resolve(process.cwd(), '.env.local') });

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=tw';

const instance = axios.create({
  baseURL: NEWS_API_URL,
  headers: { 'X-Api-Key': process.env.NEWS_API_KEY },
});

async function request(method, params, config) {
  const response = await instance.request({ method, params, ...config });
  const result = response.data;

  return result;
}

module.exports = request;
