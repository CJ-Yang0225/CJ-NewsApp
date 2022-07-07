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
  const result = window.location.search.substring(1).match(regExp);
  console.log('result:', result && decodeURIComponent(result[2]));

  return result ? decodeURIComponent(result[2]) : null;
};

/**
 * @param {string} key
 * @param {string} value
 * @param {number} ttl - Time to live (seconds)
 */
const setItemWithExpiration = (key, value, ttl) => {
  const data = {
    value,
    expiration: Date.now() + ttl * 1000,
  };

  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * @param {string} key
 * @returns {any | null}
 */
const getItemWithExpiration = (key) => {
  const dataStr = localStorage.getItem(key);
  if (dataStr) {
    const data = JSON.parse(dataStr);

    if (data.expiration < Date.now()) {
      return data.value;
    } else {
      localStorage.removeItem(key);

      return null;
    }
  }

  return null;
};

export {
  injectTpl,
  formatParams,
  sliceNewsByCount,
  getUrlSearchParams,
  setItemWithExpiration,
  getItemWithExpiration,
};
