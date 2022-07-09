import './Header.scss';
import HeaderTpl from './Header.tpl';
import { injectTpl } from '../../utils';
import Bookmark from '../Bookmark';

export default {
  name: 'Header',
  create(props) {
    const { title, backUrl, showBackIcon, showCollectionIcon, showBookmark } =
      props;

    return injectTpl(HeaderTpl, {
      title,
      backUrl,
      showBackIcon: showBackIcon ? ' inline-block' : ' none',
      showLogoIcon: showBackIcon ? ' none' : ' inline-block',
      showCollectionIcon: showCollectionIcon ? ' visible' : ' hidden',
      Bookmark: showBookmark
        ? Bookmark.create({
            className: ' header__bookmark',
            isMarked: JSON.parse(localStorage.getItem('currentNews'))?.isMarked,
          })
        : '',
    });
  },
  onChangeForBookmark(emitClick) {
    const oBookmarkCheckbox = document.querySelector(
      '.header__bookmark input[type="checkbox"]'
    );

    const handleChange = () => {
      const isMarked = oBookmarkCheckbox.checked;

      emitClick(isMarked);
    };

    oBookmarkCheckbox.addEventListener('change', handleChange);
  },
};
