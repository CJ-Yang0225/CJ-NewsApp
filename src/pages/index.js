import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsContainer from '../components/NewsContainer';
import NewsCard from '../components/NewsCard';
import Icon from '../components/Icon';
import PullHint from '../components/PullHint';
import Widgets from '../components/Widgets';
import request from '../services/request';
import {
  delay,
  getDataFromLocalStorage,
  setDataToLocalStorage,
  attachExpiration,
  getUnexpiredData,
  detectScrolledToBottom,
  getURLSearchParamValue,
  scrollByLength,
} from '../utils';
import {
  REDIRECT_TO_DETAIL,
  SWITCH_CATEGORY,
  TOGGLE_BOOKMARK,
} from '../constants/actionTypes';
import { BOOKMARKS_ITEM, NEWS_LABELS, TEMP_NEWS_ITEM } from '../constants/news';
import { throttle } from '../utils/event';

(function (doc) {
  const state = {
    category: NEWS_LABELS.find(
      ({ category }) =>
        category === (getURLSearchParamValue('category') || 'top')
    )['category'],
    cachedNews: {},
    page: 0,
    maxPage: 0,
    isLoadMoreReady: true,
  };

  /* app node */
  window.oApp = doc.getElementById('app');

  /* component instances */
  const header = new Header({
    title: '頭條新聞',
    showBackIcon: false,
    showCollectionIcon: true,
  });
  const navbar = new Navbar({ activatedCategory: state.category });
  const newsContainer = new NewsContainer({ category: state.category });
  const widgets = new Widgets();

  const init = async () => {
    render();
    await populateNews();
    useEvent();
  };

  init();

  function render() {
    oApp.append(header.el, navbar.el, newsContainer.el, widgets.el);
    navbar.updateUI();
  }

  function useEvent() {
    navbar.onSwitch(switchCategory);
    newsContainer.onAct(dispatchAction, { enableSwipe: true });
    oApp.addEventListener('scroll', throttle(loadMoreNews, 150), {
      passive: true,
    });
  }

  function switchCategory(category) {
    const oNewsContainer = newsContainer.el;

    state.page = 0;
    state.category = category;
    state.isLoadMoreReady = true;
    navbar.props.activatedCategory = category;
    navbar.updateUI();
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

      const pageSize = window.matchMedia('(min-width: 1600px)').matches
        ? 12
        : 10;
      const slicedNews = await request.getSlicedNews(category, 70, pageSize);
      cachedNews[category] = slicedNews;
      state.maxPage = slicedNews.length;

      const slicedNewsWithExpiration = attachExpiration(slicedNews, 5 * 60);
      setDataToLocalStorage(TEMP_NEWS_ITEM, {
        ...getDataFromLocalStorage(TEMP_NEWS_ITEM),
        [category]: slicedNewsWithExpiration,
      });
      loadingIcon.el.remove();

      return cachedNews[category][0] || [];
    }

    state.maxPage = cachedNews[category].length;

    return cachedNews[category][page] || [];
  }

  async function populateNews(category = state.category, page = state.page) {
    const oNewsContainer =
      newsContainer.el.dataset.category === category && newsContainer.el;

    if (!oNewsContainer) {
      return;
    }

    const slicedNewsByPage = await getNewsByPage(page);
    const newsCardList = NewsCard.createList(slicedNewsByPage, page);
    oNewsContainer.appendChild(newsCardList);

    NewsCard.triggerImagesFadeIn(page);
  }

  async function loadMoreNews() {
    if (state.isLoadMoreReady && detectScrolledToBottom(oApp, 16)) {
      const oNewsContainer = newsContainer.el;
      const currentCategory = oNewsContainer.dataset.category;
      state.isLoadMoreReady = false;
      state.page++;

      if (state.page < state.maxPage) {
        const pullHintLoading = new PullHint({ status: 'loading' });
        oNewsContainer.appendChild(pullHintLoading.el);

        const pullHintHeight = pullHintLoading.el.offsetHeight;
        scrollByLength(window.oApp, 'top', pullHintHeight);

        await delay(800); // to show pull hint
        await populateNews(currentCategory);
        pullHintLoading.el.remove();
        state.isLoadMoreReady = true;
      } else {
        const pullHintNoData = new PullHint({ status: 'no-data' });
        oNewsContainer.appendChild(pullHintNoData.el);

        const pullHintHeight = pullHintNoData.el.offsetHeight;
        scrollByLength(window.oApp, 'top', pullHintHeight);
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

      case SWITCH_CATEGORY:
        switchCategory(payload);
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
