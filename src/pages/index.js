import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import request from '../services/request';

const state = {
  category: 'top',
  cachedNews: {},
  page: 0,
};

(function (doc) {
  const oApp = doc.getElementById('app');

  const init = async () => {
    render();
    await populateNews();
    useEvent();
  };

  init();

  function render() {
    const { category } = state;

    const headerTpl = Header.setProps({
      title: '頭條新聞',
      backUrl: 'javascript:;',
      showBackIcon: false,
      showCollectionIcon: true,
    });
    const navbarTpl = Navbar.setProps({ activatedCategory: category });

    oApp.innerHTML += headerTpl + navbarTpl;

    const newsContainer = document.createElement('main');
    newsContainer.className = 'news-container';

    oApp.appendChild(newsContainer);
  }

  function useEvent() {
    Navbar.onSwitch(switchCategory);
  }

  function switchCategory(category) {
    const oNewsList = oApp.querySelector('.news-container');
    state.category = category;
    state.page = 0;
    oNewsList.innerHTML = '';
    populateNews();
  }

  async function getNewsByPage(page = state.page) {
    const { cachedNews, category } = state;

    if (cachedNews[category]) {
      if (cachedNews[category][page]) {
        return cachedNews[category][page];
      }
      return [];
    } else {
      const slicedNews = await request.getSlicedNews(category, 30);
      cachedNews[category] = slicedNews;

      return cachedNews[category][0];
    }
  }

  async function populateNews() {
    const oNewsList = oApp.querySelector('.news-container');

    const slicedNewsByPage = await getNewsByPage();
    slicedNewsByPage.forEach((article) => {
      const { urlToImage, title, source, author, publishedAt } = article;
      const NewsCardTpl = NewsCard.setProps({
        urlToImage,
        title,
        source: source.name,
        author,
        publishedAt: new Date(publishedAt).toLocaleString(),
        isCollected: false,
      });

      oNewsList.innerHTML += NewsCardTpl;
    });
  }
})(document);
