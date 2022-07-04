import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import request from '../services/request';
import LoadingIcon from '../components/Icon';
import PullHint from '../components/PullHint';
import {
  delay,
  getDocumentSize,
  getScrolledLength,
  getViewportSize,
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
    const newsContainer = doc.createElement('main');
    newsContainer.className = 'news-container';
    newsContainer.dataset.category = category;

    return newsContainer;
  }

  function useEvent() {
    Navbar.onSwitch(switchCategory);
    window.addEventListener('scroll', loadMoreNews, false);
  }

  function switchCategory(category) {
    state.category = category;
    state.page = 0;

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
      await delay(500);
      oNewsContainer.innerHTML = '';

      return cachedNews[category][0] || [];
    }
  }

  async function populateNews(category = state.category, page = state.page) {
    const oNewsContainer = oApp.querySelector(
      `.news-container[data-category="${category}"]`
    );

    if (!oNewsContainer) return;

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

    const newsCardsEl = doc.createElement('template');
    newsCardsEl.innerHTML = newsCardsTpl;

    oNewsContainer.appendChild(newsCardsEl.content);
    state.isLoading = false;
    NewsCard.triggerImagesFadeIn();
    PullHint.removeHintFrom(oNewsContainer);
  }

  async function loadMoreNews() {
    const { category } = state;
    const oNewsContainer = oApp.querySelector(
      `.news-container[data-category="${category}"]`
    );
    const hasScrollbar = getDocumentSize().height > getViewportSize().height;
    const hasReachedBottom =
      getScrolledLength().top + getViewportSize().height ===
      getDocumentSize().height;

    if (!state.isLoading && hasScrollbar && hasReachedBottom) {
      state.isLoading = true;
      const pullHintEl = doc.createElement('template');

      if (state.page < state.maxPage) {
        pullHintEl.innerHTML = PullHint.create({ status: 'loading' });

        oNewsContainer.appendChild(pullHintEl.content);

        const pullHintHeight = oNewsContainer.lastElementChild.offsetHeight;
        window.scrollBy({
          top: pullHintHeight,
          behavior: 'smooth',
        });

        await delay(1000);
        state.page++;
        populateNews(category);
      } else {
        pullHintEl.innerHTML = PullHint.create({ status: 'no-data' });

        oNewsContainer.appendChild(pullHintEl.content);
      }
    }
  }
})(document);
