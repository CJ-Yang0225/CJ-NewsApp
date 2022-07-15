import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import request from '../services/request';
import LoadingIcon from '../components/Icon';
import PullHint from '../components/PullHint';
import {
  createFragment,
  delay,
  getDataFromLocalStorage,
  setDataToLocalStorage,
  attachExpiration,
  getUnexpiredData,
  detectScrolledToBottom,
} from '../utils';
import { REDIRECT_TO_DETAIL, TOGGLE_BOOKMARK } from '../constants/actionTypes';
import { BOOKMARKS_ITEM, TEMP_NEWS_ITEM } from '../constants/news';

(function (doc) {
  const state = {
    category: 'top', // TODO pathname: ?category=top
    cachedNews: {},
    page: 0,
    maxPage: 0,
    isLoading: true,
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

    const headerTpl = Header.create({
      title: '頭條新聞',
      backUrl: 'javascript:;',
      showBackIcon: false,
      showCollectionIcon: true,
    });
    const navbarTpl = Navbar.create({ activatedCategory: category });

    oApp.innerHTML += headerTpl + navbarTpl;
    oApp.appendChild(NewsCard.Container(category));
  }

  function useEvent() {
    Navbar.onSwitch(switchCategory);
    NewsCard.onClick(dispatchAction);
    window.addEventListener('scroll', loadMoreNews, { passive: true });
  }

  function switchCategory(category) {
    const oNewsContainer = oApp.querySelector('.news-container');

    state.category = category;
    state.page = 0;
    oNewsContainer.dataset.category = category;
    oNewsContainer.innerHTML = '';

    populateNews(category, 0);
  }

  async function getNewsByPage(page = state.page) {
    const { cachedNews, category } = state;
    const oNewsContainer = oApp.querySelector('.news-container');

    const tempNews = getDataFromLocalStorage(TEMP_NEWS_ITEM) || {};
    cachedNews[category] = getUnexpiredData(tempNews[category]);

    if (!cachedNews[category]) {
      oNewsContainer.innerHTML = LoadingIcon.create({ status: 'loading' });
      const slicedNews = await request.getSlicedNews(category, 70);
      cachedNews[category] = slicedNews;

      const slicedNewsWithExpiration = attachExpiration(slicedNews, 5 * 60);
      setDataToLocalStorage(TEMP_NEWS_ITEM, {
        ...getDataFromLocalStorage(TEMP_NEWS_ITEM),
        [category]: slicedNewsWithExpiration,
      });
      LoadingIcon.removeFrom(oNewsContainer);

      return cachedNews[category][0] || [];
    }

    return cachedNews[category][page] || [];
  }

  async function populateNews(category = state.category, page = state.page) {
    const oNewsContainer = oApp.querySelector(
      `.news-container[data-category="${category}"]`
    );

    if (!oNewsContainer) {
      return;
    }

    const slicedNewsByPage = await getNewsByPage(page);
    state.maxPage = slicedNewsByPage.length;

    const newsCardList = NewsCard.createList(slicedNewsByPage, page);
    oNewsContainer.appendChild(newsCardList);

    NewsCard.triggerImagesFadeIn();
    PullHint.removeFrom(oNewsContainer);

    state.isLoading = false;
  }

  async function loadMoreNews() {
    const oNewsContainer = oApp.querySelector('.news-container');
    const currentCategory = oNewsContainer.dataset.category;

    if (!state.isLoading && detectScrolledToBottom()) {
      state.isLoading = true;
      state.page++;

      if (state.page < state.maxPage) {
        const pullHint = createFragment(PullHint.create({ status: 'loading' }));
        oNewsContainer.appendChild(pullHint);

        const pullHintHeight = oNewsContainer.lastElementChild.offsetHeight;
        window.scrollBy({
          top: pullHintHeight,
          behavior: 'smooth',
        });

        await delay(800); // to show pull hint
        populateNews(currentCategory);
      } else {
        const pullHint = createFragment(PullHint.create({ status: 'no-data' }));

        oNewsContainer.appendChild(pullHint);
      }
    }
  }

  function dispatchAction(action) {
    const { type, payload } = action;

    switch (type) {
      case REDIRECT_TO_DETAIL:
        redirectToDetail(payload);
        break;

      case TOGGLE_BOOKMARK:
        toggleBookmark(payload);
        break;
    }
  }

  function redirectToDetail({ page, index }) {
    const { cachedNews, category } = state;
    const targetNews = cachedNews[category][page][index];
    window.open(targetNews.url, `detailPage-${targetNews.url}`);
  }

  function toggleBookmark({ page, index, isMarked }) {
    const { cachedNews, category } = state;
    let bookmarks = getDataFromLocalStorage(BOOKMARKS_ITEM) || [];
    const targetNews = cachedNews[category][page][index];

    if (isMarked) {
      bookmarks.push(targetNews);
    } else {
      bookmarks = bookmarks.filter((news) => news.url !== targetNews.url);
    }

    setDataToLocalStorage(BOOKMARKS_ITEM, bookmarks);
  }
})(document);
