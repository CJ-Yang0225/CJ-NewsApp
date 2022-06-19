import HTTP from '../utils/http';

class Request extends HTTP {
  getSpecificNews(category, totalNews) {
    return new Promise((resolve, reject) => {
      this.get(`/api/news?category=${category}&pageSize=${totalNews}`, {
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

export default new Request();
