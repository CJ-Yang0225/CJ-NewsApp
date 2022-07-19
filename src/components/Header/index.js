import './Header.scss';
import HeaderTpl from './Header.tpl';
import { createFragment, injectTpl } from '../../utils';

class Header {
  constructor({ title, backUrl, showBackIcon, showCollectionIcon, tpl = '' }) {
    this.tpl = injectTpl(HeaderTpl, {
      title,
      backUrl,
      showBackIcon: showBackIcon ? ' inline-block' : ' none',
      showLogoIcon: showBackIcon ? ' none' : ' inline-block',
      showCollectionIcon: showCollectionIcon ? ' inline-block' : ' none',
      tpl,
    });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }
}

export default Header;
