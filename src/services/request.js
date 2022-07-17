import HTTP from '../utils/http';
import { formatParams, sliceNewsByCount } from '../utils';
import apiConfig from '../services/config';

const HOST = apiConfig.PROXY_SERVER_HOST;

class Request extends HTTP {
  getSlicedNews(category, totalNews = 30) {
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
          const slicedNews = sliceNewsByCount(news, 10);
          resolve(slicedNews);
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
