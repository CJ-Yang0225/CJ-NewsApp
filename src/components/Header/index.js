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
      showBackIcon: showBackIcon ? ' inline' : ' none',
      showLogoIcon: showBackIcon ? ' none' : ' inline-block',
      showCollectionIcon: showCollectionIcon ? ' visible' : ' hidden',
    });
  },
};
