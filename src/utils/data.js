/**
 * @typedef {string} Tpl
 * @param {Tpl} Template
 * @param {Object.<string, string>} data
 * @returns {Tpl} injectedTemplate
 */
const injectTpl = (Template, data) => {
  return Template.replace(/\s*\{\{(.*?)\}\}\s*/g, (_, key) => {
    return data[key.trim()];
  });
};

const formatParams = (url = '/api', params, formatter) => {
  /\?$/.test(url) || (url += '?');

  url += params
    .map((param) => formatter(param).join('='))
    .filter(Boolean)
    .join('&');

  return url;
};

const sliceNewsByCount = (news = [], count = 10) => {
  const totalNews = news.length;
  const slicedNews = [];
  let newsIndex = 0;

  while (newsIndex < totalNews) {
    const startIndex = newsIndex;
    const endIndex = (newsIndex += count);
    slicedNews.push(news.slice(startIndex, endIndex));
  }

  return slicedNews;
};

const getUrlSearchParams = (key) => {
  const regExp = new RegExp(`(^|&)${key}=([^&#]*)(|&$)`, 'i');
  const result = location.search.substring(1).match(regExp);

  return result ? decodeURIComponent(result[2]) : null;
};

/**
 * @param {any} data
 * @param {number} ttl Time to live (seconds)
 * @returns {object} The data with expiration
 */
const attachExpiration = (data, ttl) => {
  const expiration = Date.now() + ttl * 1000;

  return { value: data, expiration };
};

/**
 * @param {string} key localStorage item key
 * @param {any} data The data that will be set to localStorage as item
 * @param {number} [ttl] - Time to live (seconds)
 */
const setDataToLocalStorage = (key, data, ttl) => {
  let value = null;

  value =
    typeof ttl === 'number' && ttl >= 0 ? attachExpiration(data, ttl) : data;

  localStorage.setItem(key, JSON.stringify(value));
};

/**
 *
 * @param {object} data
 * @returns {any | null} The unexpired data or `null`
 */
const getUnexpiredData = (data) => {
  if (data) {
    const { expiration, value } = data;

    if (expiration) {
      const isUnexpired = Date.now() < expiration;
      return isUnexpired ? value : null;
    }

    return data;
  }

  return null;
};

/**
 * @param {string} key localStorage item key
 * @returns {any | null} The data from unexpired localStorage item or `null`
 */
const getDataFromLocalStorage = (key) => {
  const data = JSON.parse(localStorage.getItem(key));

  const unexpiredData = getUnexpiredData(data);

  if (unexpiredData === null) {
    localStorage.removeItem(key);
    return null;
  }

  return unexpiredData;
};

export {
  injectTpl,
  formatParams,
  sliceNewsByCount,
  getUrlSearchParams,
  attachExpiration,
  setDataToLocalStorage,
  getUnexpiredData,
  getDataFromLocalStorage,
};
