import '../styles/index.scss';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import request from '../services/request';
import LoadingIcon from '../components/Icon';
import PullHint from '../components/PullHint';
import {
  createFragment,
  createNewsContainer,
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

  function useEvent() {
    Navbar.onSwitch(switchCategory);
    window.addEventListener('scroll', loadMoreNews, false);
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

    if (cachedNews[category]) {
      return cachedNews[category][page] || [];
    } else {
      oNewsContainer.innerHTML = LoadingIcon.create({ status: 'loading' });
      const { maxPage, slicedNews } = await request.getSlicedNews(category, 70);
      state.maxPage = maxPage;
      cachedNews[category] = slicedNews;
      await delay(500); // to show loading icon
      LoadingIcon.removeFrom(oNewsContainer);

      return cachedNews[category][0] || [];
    }
  }

  async function populateNews(category = state.category, page = state.page) {
    const oNewsContainer = oApp.querySelector(
      `.news-container[data-category="${category}"]`
    );

    if (!oNewsContainer) {
      return;
    }

    const slicedNewsByPage = await getNewsByPage(page);
    const newsCardsTpl = slicedNewsByPage.reduce(
      (newsCardsTplFrag, news, index) => {
        const { urlToImage, title, description, source, author, publishedAt } =
          news;
        const newsCardTpl = NewsCard.create({
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

        return newsCardsTplFrag + newsCardTpl;
      },
      ''
    );
    const newsCards = createFragment(newsCardsTpl);

    oNewsContainer?.appendChild(newsCards);

    NewsCard.triggerImagesFadeIn();
    PullHint.removeFrom(oNewsContainer);

    state.isLoading = false;
  }

  async function loadMoreNews() {
    const oNewsContainer = oApp.querySelector('.news-container');
    const hasScrollbar = getDocumentSize().height > getViewportSize().height;
    const hasReachedBottom =
      getScrolledLength().top + getViewportSize().height ===
      getDocumentSize().height;

    if (!state.isLoading && hasScrollbar && hasReachedBottom) {
      state.isLoading = true;

      if (state.page < state.maxPage) {
        const pullHint = createFragment(PullHint.create({ status: 'loading' }));
        oNewsContainer.appendChild(pullHint);

        const pullHintHeight = oNewsContainer.lastElementChild.offsetHeight;
        window.scrollBy({
          top: pullHintHeight,
          behavior: 'smooth',
        });

        const category = oNewsContainer.dataset.category;
        state.page++;
        await delay(1000); // to show pull hint

        populateNews(category);
      } else {
        const pullHint = createFragment(PullHint.create({ status: 'no-data' }));

        oNewsContainer.appendChild(pullHint);
      }
    }
  }
})(document);
