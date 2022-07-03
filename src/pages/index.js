import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import request from '../services/request';
import LoadingIcon from '../components/Icon';
import {
  delay,
  getDocumentSize,
  getScrolledLength,
  getViewportSize,
  scrollToTop,
} from '../utils';

(function (doc) {
  const state = {
    category: 'top',
    cachedNews: {},
    page: 0,
    maxPage: 0,
    isLoading: true,
  };

  const oApp = doc.getElementById('app');
  let loadMoreTimer = null;

  const init = async () => {
    render();
    await populateNews();
    useEvent();
  };

  init();

  function render() {
    const { category } = state;

    const headerTpl = Header.create({
      title: '頭條新聞',
      backUrl: 'javascript:;',
      showBackIcon: false,
      showCollectionIcon: true,
    });
    const navbarTpl = Navbar.create({ activatedCategory: category });

    oApp.innerHTML += headerTpl + navbarTpl;

    oApp.appendChild(createNewsContainer(category));
  }

  function createNewsContainer(category) {
    const newsContainer = document.createElement('main');
    newsContainer.className = 'news-container';
    newsContainer.dataset.category = category;

    return newsContainer;
  }

  function useEvent() {
    Navbar.onSwitch(switchCategory);
    window.addEventListener('scroll', loadMoreNews, false);
  }

  function switchCategory(category) {
    // const oNewsContainer = oApp.querySelector('.news-container');
    state.category = category;
    state.page = 0;
    // clearTimeout(loadMoreTimer);
    // oNewsContainer.dataset.category = category;
    // oNewsContainer.innerHTML = '';

    oApp.querySelector('.news-container').remove();
    oApp.appendChild(createNewsContainer(category));
    populateNews();
  }

  async function getNewsByPage(category = state.category, page = state.page) {
    const { cachedNews } = state;
    const oNewsContainer = oApp.querySelector(
      `.news-container[data-category="${category}"]`
    );

    if (cachedNews[category]) {
      return cachedNews[category][page] || [];
    } else {
      oNewsContainer.innerHTML = LoadingIcon.create({ status: 'loading' });
      const { maxPage, slicedNews } = await request.getSlicedNews(category, 70);
      state.maxPage = maxPage;
      cachedNews[category] = slicedNews;
      // await delay(1500);
      oNewsContainer.innerHTML = '';

      return cachedNews[category][0] || [];
    }
  }

  async function populateNews(category = state.category, page = state.page) {
    const oNewsContainer = oApp.querySelector(
      `.news-container[data-category="${category}"]`
    );

    const slicedNewsByPage = await getNewsByPage(category, page);
    const newsCardsTpl = slicedNewsByPage.reduce(
      (newsCardsTplFrag, news, index) => {
        const { urlToImage, title, description, source, author, publishedAt } =
          news;
        const newsCardTplFrag = NewsCard.create({
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

    const newsCardsEl = document.createElement('template');
    newsCardsEl.innerHTML = newsCardsTpl;

    oNewsContainer.appendChild(newsCardsEl.content);
    state.isLoading = false;
    NewsCard.triggerImagesFadeIn();
  }

  async function loadMoreNews() {
    const { category } = state;
    const hasScrollbar = getDocumentSize().height > getViewportSize().height;
    const hasReachedBottom =
      getScrolledLength().top + getViewportSize().height ===
      getDocumentSize().height;
    // console.log(
    //   hasScrollbar,
    //   getDocumentSize().height -
    //     (getScrolledLength().top + getViewportSize().height)
    // );

    if (!state.isLoading && hasScrollbar && hasReachedBottom) {
      if (state.page < state.maxPage) {
        state.isLoading = true;
        // loadMoreTimer = setTimeout(() => {
        //   console.log('load more!');
        //   state.page++;
        //   populateNews();
        // }, 1000);
        await delay(1000);
        console.log('Load more');
        state.page++;
        populateNews(category);

        /* Test */

        // switchCategory('sports');
        // scrollToTop();
      }
    }
  }
})(document);
