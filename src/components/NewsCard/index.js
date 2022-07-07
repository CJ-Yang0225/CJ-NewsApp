import './NewsCard.scss';
import NewsCardTpl from './NewsCard.tpl';
import Bookmark from '../Bookmark';
import { injectTpl } from '../../utils';
import {
  REDIRECT_TO_DETAIL,
  TOGGLE_BOOKMARK,
} from '../../constants/actionTypes';

export default {
  name: 'NewsCard',
  state: { loadingPage: 0 },
  create(props) {
    const {
      page,
      index,
      urlToImage,
      title,
      description,
      source,
      author,
      publishedAt,
      isMarked,
    } = props;

    this.state.loadingPage = page;

    return injectTpl(NewsCardTpl, {
      page,
      index,
      urlToImage: urlToImage || '',
      title,
      description: description || '',
      source: source || '',
      author: author || '',
      hasSource: source ? '' : 'display: none;',
      hasAuthor: author ? '' : 'display: none;',
      publishedAt,
      Bookmark: Bookmark.create({
        isMarked,
        className: ' news-card__bookmark',
      }),
    });
  },
  container(category) {
    const newsContainer = document.createElement('main');
    newsContainer.className = 'news-container';
    newsContainer.dataset.category = category;

    return newsContainer;
  },
  triggerImagesFadeIn() {
    const { loadingPage } = this.state;
    const oImages = document.querySelectorAll(
      `.news-card[data-page="${loadingPage}"] .news-card__thumbnail`
    );
    oImages.forEach((oImage) => {
      // image is cached by browser
      if (oImage.complete) {
        oImage.style.animationPlayState = 'running';
      } else {
        oImage.onload = () => {
          oImage.style.animationPlayState = 'running';
        };
      }
    });
  },
  onClick(emitClick) {
    const oNewsContainer = document.querySelector('.news-container');

    const handleClick = (event) => {
      const target = event.target;
      const oNewsCard = target.closest('.news-card');

      if (target.closest('.news-card__bookmark')) {
        // Prevent click event of label from automatically triggering input
        event.preventDefault();

        const oBookmark = target.closest('.news-card__bookmark');
        const [oCheckbox] = oBookmark.children;
        const isMarked = (oCheckbox.checked = !oCheckbox.checked); // Manually change checkbox state

        emitClick({
          type: TOGGLE_BOOKMARK,
          payload: { ...oNewsCard.dataset, isMarked },
        });
      } else if (
        target.closest('.news-card__title') ||
        target.closest('.news-card__thumbnail')
      ) {
        if (oNewsCard) {
          emitClick({ type: REDIRECT_TO_DETAIL, payload: oNewsCard.dataset });
        }
      }
    };

    oNewsContainer.addEventListener('click', handleClick);
  },
};
