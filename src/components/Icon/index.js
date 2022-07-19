import './Icon.scss';
import IconTpl from './Icon.tpl';
import { createFragment, injectTpl } from '../../utils';
import loadingIconUrl from '../../assets/images/loading.gif';

class Icon {
  constructor({ status, className = '', iconUrl }) {
    this.tpl = injectTpl(IconTpl, {
      iconUrl: iconUrl || loadingIconUrl,
      status: status ? ` icon-tpl--${status}` : '',
      className,
    });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }
}

export default Icon;
