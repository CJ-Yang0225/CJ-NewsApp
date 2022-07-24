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

  onAct(emitAction, { enableSwipe = false } = {}) {
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

    oNewsContainer.addEventListener('click', handleClick);

    if (enableSwipe) {
      let containerWidth = this.el.offsetWidth;
      let isMoving = false;
      let startX = 0;
      let startY = 0;
      let deltaX = 0;
      let activatedIndex = 0;
      const categories = NEWS_LABELS.map((label) => label.category);

      const handleTouchStart = (event) => {
        oNewsContainer.insertAdjacentHTML(
          'beforeend',
          /* html */ `
          <span
            class="material-icons-outlined news-container__swipe-hint news-container__swipe-hint--left"
          >
            swipe_right
          </span>
          <span
            class="material-icons-outlined news-container__swipe-hint news-container__swipe-hint--right"
          >
            swipe_left
          </span>
          `
        );

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
        const distanceY = Math.abs(startY - currentY);

        if (
          (currentX > startX && activatedIndex === 0) ||
          (currentX < startX && activatedIndex === categories.length - 1) ||
          distanceY > 24
        ) {
          return;
        }

        isMoving = true;
        deltaX = startX - currentX;

        const [oHintLeft, oHintRight] = oNewsContainer.querySelectorAll(
          '.news-container__swipe-hint'
        );

        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        oHintLeft.style.transform = `translateX(${clamp(
          -deltaX,
          -containerWidth / 5,
          containerWidth / 5
        )}px)`;
        oHintRight.style.transform = `translateX(${clamp(
          -deltaX,
          -containerWidth / 5,
          containerWidth / 5
        )}px)`;
      };

      const handleTouchEnd = () => {
        const [oHintLeft, oHintRight] = oNewsContainer.querySelectorAll(
          '.news-container__swipe-hint'
        );

        oHintLeft?.remove();
        oHintRight?.remove();

        if (!isMoving) return;

        if (Math.abs(deltaX) >= containerWidth / 5) {
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
      };

      oNewsContainer.addEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      oNewsContainer.addEventListener('touchmove', handleTouchMove, {
        passive: true,
      });
      oNewsContainer.addEventListener('touchend', handleTouchEnd);
    }
  }
}

export default NewsContainer;
