import '../styles/collections.scss';
import Header from '../components/Header';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../utils';
import NewsCard from '../components/NewsCard';
import { BOOKMARKS_ITEM } from '../constants/news';
import { REDIRECT_TO_DETAIL, TOGGLE_BOOKMARK } from '../constants/actionTypes';

(function (doc, getBookmarks) {
  const state = {
    editMode: false,
    bookmarkForEditing: [],
  };

  const oApp = doc.getElementById('app');

  const init = () => {
    render();
    populateNews();
    useEvent();
  };

  init();

  function render() {
    const headerTpl = Header.create({
      title: '已收藏的新聞',
      backUrl: './index.html',
      showBackIcon: true,
      showCollectionIcon: false,
      tpl: '<button id="management">管理</button>',
    });

    oApp.innerHTML += headerTpl;
    oApp.appendChild(NewsCard.Container('all'));
  }

  function useEvent() {
    NewsCard.onClick(dispatchAction);
    oApp.querySelector('#management').addEventListener('click', switchEidtMode);
  }

  function switchEidtMode(event) {
    const oButton = event.currentTarget;
    const oNewsContainer = oApp.querySelector('.news-container');

    const prevEditMode = state.editMode;
    state.editMode = !state.editMode;

    if (state.editMode) {
      state.bookmarkForEditing = getBookmarks();
      console.log(state.bookmarkForEditing);

      oButton.textContent = '確定';
      oNewsContainer.classList.add('news-container--editing');
    } else {
      oButton.textContent = '管理';
      oNewsContainer.classList.remove('news-container--editing');
    }

    if (prevEditMode === true && state.editMode === false) {
      setDataToLocalStorage(BOOKMARKS_ITEM, state.bookmarkForEditing);
      oNewsContainer.innerHTML = '';
      populateNews();
    }
  }

  function populateNews() {
    const oNewsContainer = oApp.querySelector('.news-container');

    const newsCardList = NewsCard.createList(getBookmarks());
    oNewsContainer.appendChild(newsCardList);

    NewsCard.triggerImagesFadeIn();
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

  function redirectToDetail({ index }) {
    const bookmarks = getBookmarks();
    const currentNews = bookmarks[index];
    location.href = currentNews.url;
  }

  function toggleBookmark({ index, isMarked }) {
    if (state.editMode && !isMarked) {
      state.bookmarkForEditing = state.bookmarkForEditing.filter(
        (_, bookmarkIndex) => bookmarkIndex != index
      );
    }
  }
})(document, getDataFromLocalStorage.bind(window, BOOKMARKS_ITEM));
