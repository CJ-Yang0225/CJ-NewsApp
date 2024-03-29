import HTTP from '../utils/http';
import { formatParams, sliceNewsByCount } from '../utils';
import apiConfig from '../services/config';

const HOST = apiConfig.PROXY_SERVER_HOST;

class Request extends HTTP {
  getSlicedNews(category, totalNews = 30, pageSize = 10) {
    return new Promise((resolve, reject) => {
      const url = formatParams(
        `${HOST}/api/news`,
        [
          ['category', category],
          ['pageSize', totalNews],
        ],
        newsFormatter
      );

      this.get(url, {
        onSuccess(result) {
          const news = result.articles;
          const slicedNews = sliceNewsByCount(news, pageSize);
          resolve(slicedNews);
        },
        onError(error) {
          reject(error);
        },
      });
    });
  }

  getNews(category, pageSize = 10, pageNumber = 0) {
    return new Promise((resolve, reject) => {
      const url = formatParams(
        `${HOST}/api/news`,
        [
          ['category', category],
          ['pageSize', pageSize],
          ['page', pageNumber],
        ],
        newsFormatter
      );

      this.get(url, {
        onSuccess(result) {
          const { totalResults, articles: news } = result;
          const maxPage = Math.ceil(totalResults / pageSize);
          resolve({ maxPage, news });
        },
        onError(error) {
          reject(error);
        },
      });
    });
  }
}

function newsFormatter(param) {
  const [key, value] = param;

  if (!key || !value) {
    return [];
  }

  if (key === 'category' && value === 'top') {
    return [];
  }

  return param;
}

export default new Request();
