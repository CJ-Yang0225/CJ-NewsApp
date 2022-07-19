import './PullHint.scss';
import PullHintTpl from './PullHint.tpl';
import { createFragment, injectTpl } from '../../utils';
import Icon from '../Icon';
import iconUrl from '../../assets/images/spin_loading.gif';

class PullHint {
  constructor({ status, text }) {
    const spinIcon = new Icon({ iconUrl, className: ' pull-hint__icon' });

    this.tpl = injectTpl(PullHintTpl, {
      status: status ? ` pull-hint--${status}` : '',
      Icon: spinIcon.tpl,
      text:
        text ||
        (status === 'loading'
          ? '載入更多新聞中'
          : status === 'no-data'
          ? '沒有更多新聞了'
          : ''),
    });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }
}

export default PullHint;
