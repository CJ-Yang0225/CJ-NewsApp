import HTTP from '../utils/http';
import { formatParams } from '../utils';

class Request extends HTTP {
  getSpecificNews(category, totalNews) {
    return new Promise((resolve, reject) => {
      const url = formatParams(
        '/api/news',
        [
          ['category', category],
          ['pageSize', totalNews],
        ],
        newsFormatter
      );

      this.get(url, {
        onSuccess(result) {
          resolve(result);
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
