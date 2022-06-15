import './Header.scss';
import HeaderTpl from './Header.tpl';
import { injectTpl } from '../../utils';

export default {
  name: 'Header',
  setProps(props) {
    const { title, backUrl, showBackIcon, showCollectionIcon } = props;

    return injectTpl(HeaderTpl, {
      title,
      backUrl,
      showBackIcon: showBackIcon ? 'block' : 'none',
      showLogoIcon: showBackIcon ? 'none' : 'block',
      showCollectionIcon: showCollectionIcon ? 'visible' : 'hidden',
    });
  },
};
