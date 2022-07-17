import '../styles/collections.scss';
import Header from '../components/Header';
import { getDataFromLocalStorage, setDataToLocalStorage } from '../utils';
import NewsCard from '../components/NewsCard';
import { BOOKMARKS_ITEM } from '../constants/news';
import { REDIRECT_TO_DETAIL, TOGGLE_BOOKMARK } from '../constants/actionTypes';

(function (doc, getBookmarks) {
  const state = {
    editMode: false,
    bookmarks: [],
    bookmarksForEditing: [],
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
      backUrl: '/',
      showBackIcon: true,
      showCollectionIcon: false,
      tpl: '<button id="management">管理</button>',
    });

    oApp.insertAdjacentHTML('afterbegin', headerTpl);
    oApp.appendChild(NewsCard.Container('all'));
  }

  function useEvent() {
    NewsCard.onClick(dispatchAction);
    oApp.querySelector('#management').addEventListener('click', switchEditMode);
  }

  function switchEditMode(event) {
    const { editMode: prevEditMode } = state;
    const oButton = event.currentTarget;
    const oNewsContainer = oApp.querySelector('.news-container');

    state.editMode = !prevEditMode;

    if (state.editMode) {
      state.bookmarksForEditing = getBookmarks();

      oButton.textContent = '確定';
      oNewsContainer.classList.add('news-container--editing');
    } else {
      oButton.textContent = '管理';
      oNewsContainer.classList.remove('news-container--editing');
    }

    if (prevEditMode === true && state.editMode === false) {
      setDataToLocalStorage(BOOKMARKS_ITEM, state.bookmarksForEditing);
    }

    oNewsContainer.innerHTML = '';
    populateNews();
  }

  function populateNews() {
    const oNewsContainer = oApp.querySelector('.news-container');

    state.bookmarks = getBookmarks() || [];
    const newsCardList = NewsCard.createList(state.bookmarks);
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
    const bookmarks = state.bookmarks;
    const targetBookmarks = bookmarks[index];
    window.open(targetBookmarks.url, `detailPage-${targetBookmarks.url}`);
  }

  function toggleBookmark({ index, isMarked }) {
    if (state.editMode) {
      const { bookmarks, bookmarksForEditing } = state;
      const targetBookmark = bookmarks[index];

      if (!isMarked) {
        state.bookmarksForEditing = bookmarksForEditing.filter(
          (editingBookmark) => editingBookmark.url !== targetBookmark.url
        );
      } else {
        state.bookmarksForEditing.splice(index, 0, targetBookmark);
      }
    }
  }
})(document, getDataFromLocalStorage.bind(window, BOOKMARKS_ITEM));
