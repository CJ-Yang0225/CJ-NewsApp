import './NewsContainer.scss';
import NewsContainerTpl from './NewsContainer.tpl';
import { createFragment, injectTpl } from '../../utils';
import {
  REDIRECT_TO_DETAIL,
  TOGGLE_BOOKMARK,
} from '../../constants/actionTypes';

class NewsContainer {
  constructor({ className = '', category = '' }) {
    this.tpl = injectTpl(NewsContainerTpl, {
      className,
      category,
    });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }

  onClick(emitClick) {
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
  }
}

export default NewsContainer;

// export default {
//   name: 'NewsContainer',
//   create(props) {
//     const { className = '', category = '' } = props;

//     return injectTpl(NewsContainerTpl, {
//       className,
//       category,
//     });
//   },

//   onClick(emitClick) {
//     const oNewsContainer = document.querySelector('.news-container');

//     const handleClick = (event) => {
//       // Prevent click event of label from automatically triggering input and <a> tag default behavior
//       event.preventDefault();
//       const target = event.target;
//       const oNewsCard = target.closest('.news-card');

//       if (target.closest('.news-card__bookmark')) {
//         const oBookmark = target.closest('.news-card__bookmark');
//         const [oCheckbox] = oBookmark.children;
//         const isMarked = (oCheckbox.checked = !oCheckbox.checked); // Manually change checkbox state

//         emitClick({
//           type: TOGGLE_BOOKMARK,
//           payload: { ...oNewsCard.dataset, isMarked },
//         });
//       } else if (
//         target.closest('.news-card__title') ||
//         target.closest('.news-card__thumbnail')
//       ) {
//         if (oNewsCard) {
//           emitClick({ type: REDIRECT_TO_DETAIL, payload: oNewsCard.dataset });
//         }
//       }
//     };

//     oNewsContainer.addEventListener('click', handleClick);
//   },
// };
