import './NewsContainer.scss';
import NewsContainerTpl from './NewsContainer.tpl';
import {
  createFragment,
  getURLSearchParamValue,
  injectTpl,
  scrollToTop,
  setURLSearchParam,
} from '../../utils';
import {
  REDIRECT_TO_DETAIL,
  SWITCH_CATEGORY,
  TOGGLE_BOOKMARK,
} from '../../constants/actionTypes';
import { NEWS_LABELS } from '../../constants/news';

class NewsContainer {
  constructor({ className = '', category = '' }) {
    this.tpl = injectTpl(NewsContainerTpl, {
      className,
      category,
    });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }

  onAct(emitAction) {
    const oNewsContainer = this.el;

    const handleClick = (event) => {
      // Prevent click event of label from automatically triggering input and <a> tag default behavior
      event.preventDefault();
      const target = event.target;
      const oNewsCard = target.closest('.news-card');

      if (target.closest('.news-card__bookmark')) {
        const oBookmark = target.closest('.news-card__bookmark');
        const [oCheckbox] = oBookmark.children;
        const isMarked = (oCheckbox.checked = !oCheckbox.checked); // Manually change checkbox state

        emitAction({
          type: TOGGLE_BOOKMARK,
          payload: { ...oNewsCard.dataset, isMarked },
        });
      } else if (
        target.closest('.news-card__title') ||
        target.closest('.news-card__thumbnail')
      ) {
        if (oNewsCard) {
          emitAction({ type: REDIRECT_TO_DETAIL, payload: oNewsCard.dataset });
        }
      }
    };

    let containerWidth = this.el.offsetWidth;
    let isMoving = false;
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let activatedIndex = 0;
    const categories = NEWS_LABELS.map((label) => label.category);

    const handleTouchStart = (event) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      activatedIndex = NEWS_LABELS.findIndex(
        ({ category }) =>
          category === (getURLSearchParamValue('category') || 'top')
      );
    };

    const handleTouchMove = (event) => {
      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const distanceX = Math.abs(startX - currentX);
      const distanceY = Math.abs(startY - currentY);

      if (distanceX > distanceY) event.preventDefault();

      if (
        (currentX > startX && activatedIndex === 0) ||
        (currentX < startX && activatedIndex === categories.length - 1) ||
        distanceY > 20
      ) {
        return;
      }

      isMoving = true;
      deltaX = startX - currentX;

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      oNewsContainer.style.transform = `translateX(${clamp(
        -deltaX,
        -containerWidth / 5,
        containerWidth / 5
      )}px)`;
    };

    const handleTouchEnd = () => {
      if (!isMoving) return;

      if (Math.abs(deltaX) >= containerWidth / 4.5) {
        if (deltaX > 0) {
          activatedIndex++;
        } else if (deltaX < 0) {
          activatedIndex--;
        }

        emitAction({
          type: SWITCH_CATEGORY,
          payload: categories[activatedIndex],
        });

        if (oNewsContainer.dataset.category === categories[activatedIndex]) {
          setURLSearchParam('category', oNewsContainer.dataset.category);
        }
        scrollToTop(oApp);
      }

      isMoving = false;
      startX = 0;
      deltaX = 0;

      oNewsContainer.style.transform = '';
    };

    oNewsContainer.addEventListener('click', handleClick);
    oNewsContainer.addEventListener('touchstart', handleTouchStart);
    oNewsContainer.addEventListener('touchmove', handleTouchMove);
    oNewsContainer.addEventListener('touchend', handleTouchEnd);
  }
}

export default NewsContainer;
