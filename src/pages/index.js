import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import request from '../services/request';
import LoadingIcon from '../components/Icon';
import { delay } from '../utils';

(function (doc) {
  const state = {
    category: 'top',
    cachedNews: {},
    page: 0,
  };

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
    const oNewsContainer = oApp.querySelector('.news-container');
    state.category = category;
    state.page = 0;
    oNewsContainer.innerHTML = '';
    populateNews();
  }

  async function getNewsByPage(page = state.page) {
    const { cachedNews, category } = state;
    const oNewsContainer = oApp.querySelector('.news-container');

    if (cachedNews[category]) {
      if (cachedNews[category][page]) {
        return cachedNews[category][page];
      }
      return [];
    } else {
      oNewsContainer.innerHTML = LoadingIcon.setProps({ status: 'loading' });
      cachedNews[category] = await request.getSlicedNews(category, 30);
      await delay(1500);
      oNewsContainer.innerHTML = '';

      return cachedNews[category][0];
    }
  }

  async function populateNews() {
    const { page } = state;
    const oNewsContainer = oApp.querySelector('.news-container');

    const slicedNewsByPage = await getNewsByPage();
    const newsCardsTpl = slicedNewsByPage.reduce(
      (newsCardsTplFrag, news, index) => {
        const { urlToImage, title, description, source, author, publishedAt } =
          news;
        const newsCardTplFrag = NewsCard.setProps({
          page,
          index,
          urlToImage,
          title,
          description,
          source: source.name,
          author,
          publishedAt: new Date(publishedAt).toLocaleString(),
          isCollected: false,
        });

        return newsCardsTplFrag + newsCardTplFrag;
      },
      ''
    );

    oNewsContainer.innerHTML += newsCardsTpl;
    NewsCard.triggerImagesFadeIn();
  }
})(document);
