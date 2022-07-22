const axios = require('axios');
const { resolve } = require('path');
require('dotenv').config({ path: resolve(process.cwd(), '.env.local') });

const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines?country=tw';

const newsApiKeyNames = Object.keys(process.env).filter((prop) =>
  prop.startsWith('NEWS_API_KEY')
);

let number = 0;
let currentApiKeyName = newsApiKeyNames[number];

const axiosInstance = axios.create({
  baseURL: NEWS_API_URL,
  headers: { 'X-Api-Key': process.env[currentApiKeyName] },
});

async function request(method, params, config) {
  console.log("Current API Key's Name:", currentApiKeyName);

  const result = await axiosInstance.request({ method, params, ...config });
  const data = result.data;

  return data;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('News API Error:', error.response.data);

    if (error.response.status === 429) {
      if (number < newsApiKeyNames.length - 1) {
        number++;
      } else {
        number = 0;
      }

      currentApiKeyName = newsApiKeyNames[number];
      axiosInstance.defaults.headers['X-Api-Key'] =
        process.env[currentApiKeyName];
    }

    return Promise.reject(error);
  }
);

module.exports = request;
