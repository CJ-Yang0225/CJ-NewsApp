const injectTpl = (template, data) => {
  return template.replace(/\s*\{\{(.*?)\}\}\s*/g, (_, key) => {
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

const sliceNewsByCount = (news, count = 10) => {
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

const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
};

export { injectTpl, formatParams, sliceNewsByCount, scrollToTop };
