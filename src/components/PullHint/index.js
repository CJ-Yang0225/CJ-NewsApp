import './PullHint.scss';
import PullHintTpl from './PullHint.tpl';
import { injectTpl } from '../../utils';
import Icon from '../Icon';
import iconUrl from '../../assets/images/spin_loading.gif';

export default {
  name: 'PullHint',
  create(props) {
    const { status, text } = props;

    return injectTpl(PullHintTpl, {
      status: status ? ` pull-hint--${status}` : '',
      Icon: Icon.create({ iconUrl, className: ' pull-hint__icon' }),
      text:
        text ||
        (status === 'loading'
          ? '載入更多新聞中'
          : status === 'no-data'
          ? '沒有更多新聞了'
          : ''),
    });
  },
  removeFrom(parentEl) {
    const oPullHint = parentEl?.querySelector('.pull-hint');
    oPullHint?.remove();
  },
};
