import './Header.scss';
import HeaderTpl from './Header.tpl';
import { injectTpl } from '../../utils';

export default {
  name: 'Header',
  create(props) {
    const {
      title,
      backUrl,
      showBackIcon,
      showCollectionIcon,
      tpl = '',
    } = props;

    return injectTpl(HeaderTpl, {
      title,
      backUrl,
      showBackIcon: showBackIcon ? ' inline-block' : ' none',
      showLogoIcon: showBackIcon ? ' none' : ' inline-block',
      showCollectionIcon: showCollectionIcon ? ' inline-block' : ' none',
      tpl,
    });
  },
  onChangeForBookmark(emitChange) {
    const oBookmarkCheckbox = document.querySelector(
      '.header__bookmark input[type="checkbox"]'
    );

    const handleChange = () => {
      const isMarked = oBookmarkCheckbox.checked;

      emitChange(isMarked);
    };

    oBookmarkCheckbox.addEventListener('change', handleChange);
  },
};
