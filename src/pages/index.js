import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsContainer from '../components/NewsContainer';
import NewsCard from '../components/NewsCard';
import Icon from '../components/Icon';
import PullHint from '../components/PullHint';
import request from '../services/request';
import {
  delay,
  getDataFromLocalStorage,
  setDataToLocalStorage,
  attachExpiration,
  getUnexpiredData,
  detectScrolledToBottom,
  getURLSearchParamValue,
} from '../utils';
import { REDIRECT_TO_DETAIL, TOGGLE_BOOKMARK } from '../constants/actionTypes';
import { BOOKMARKS_ITEM, NEWS_LABELS, TEMP_NEWS_ITEM } from '../constants/news';

(function (doc) {
  const state = {
    category: NEWS_LABELS.find(
      ({ category }) =>
        category === (getURLSearchParamValue('category') || 'top')
    )['category'],
    cachedNews: {},
    page: 0,
    maxPage: 0,
    isLoading: true,
  };

  /* app root */
  const oApp = doc.getElementById('app');

  /* components */
  const header = new Header({
    title: '頭條新聞',
    showBackIcon: false,
    showCollectionIcon: true,
  });
  const navbar = new Navbar({ activatedCategory: state.category });
  const newsContainer = new NewsContainer({ category: state.category });

  const init = async () => {
    render();
    await populateNews();
    useEvent();
  };

  init();

  function render() {
    oApp.append(header.el, navbar.el, newsContainer.el);
  }

  function useEvent() {
    navbar.onSwitch(switchCategory);
    newsContainer.onClick(dispatchAction);
    window.addEventListener('scroll', loadMoreNews, { passive: true });
  }

  function switchCategory(category) {
    const oNewsContainer = newsContainer.el;

    state.category = category;
    state.page = 0;
    oNewsContainer.dataset.category = category;
    oNewsContainer.innerHTML = '';

    populateNews(category, 0);
  }

  async function getNewsByPage(page = state.page) {
    const { cachedNews, category } = state;
    const oNewsContainer = newsContainer.el;

    const tempNews = getDataFromLocalStorage(TEMP_NEWS_ITEM) || {};
    cachedNews[category] = getUnexpiredData(tempNews[category]);

    if (!cachedNews[category] || cachedNews[category].length === 0) {
      const loadingIcon = new Icon({ status: 'loading' });
      oNewsContainer.appendChild(loadingIcon.el);

      const slicedNews = await request.getSlicedNews(category, 70);
      cachedNews[category] = slicedNews;

      const slicedNewsWithExpiration = attachExpiration(slicedNews, 5 * 60);
      setDataToLocalStorage(TEMP_NEWS_ITEM, {
        ...getDataFromLocalStorage(TEMP_NEWS_ITEM),
        [category]: slicedNewsWithExpiration,
      });
      loadingIcon.el.remove();

      return cachedNews[category][0] || [];
    }

    return cachedNews[category][page] || [];
  }

  async function populateNews(category = state.category, page = state.page) {
    const oNewsContainer =
      newsContainer.el.dataset.category === category && newsContainer.el;

    if (!oNewsContainer) {
      return;
    }

    const slicedNewsByPage = await getNewsByPage(page);
    state.maxPage = slicedNewsByPage.length;

    const newsCardList = NewsCard.createList(slicedNewsByPage, page);
    oNewsContainer.appendChild(newsCardList);

    NewsCard.triggerImagesFadeIn(page);

    state.isLoading = false;
  }

  async function loadMoreNews() {
    const oNewsContainer = newsContainer.el;
    const currentCategory = oNewsContainer.dataset.category;

    if (!state.isLoading && detectScrolledToBottom()) {
      state.isLoading = true;
      state.page++;

      if (state.page < state.maxPage) {
        const pullHint = new PullHint({ status: 'loading' });
        oNewsContainer.appendChild(pullHint.el);

        const pullHintHeight = pullHint.el.offsetHeight;
        window.scrollBy({
          top: pullHintHeight,
          behavior: 'smooth',
        });

        await delay(800); // to show pull hint
        await populateNews(currentCategory);
        pullHint.el.remove();
      } else {
        const pullHint = new PullHint({ status: 'no-data' });

        oNewsContainer.appendChild(pullHint.el);
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
