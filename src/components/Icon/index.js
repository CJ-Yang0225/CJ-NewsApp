import './Icon.scss';
import IconTpl from './Icon.tpl';
import { injectTpl } from '../../utils';
import loadingIconUrl from '../../assets/images/loading.gif';

export default {
  name: 'Icon',
  create(props) {
    const { status, iconUrl } = props;

    return injectTpl(IconTpl, {
      iconUrl: iconUrl || loadingIconUrl,
      status: status ? ` icon-tpl--${status}` : '',
    });
  },
  removeFrom(parentEl) {
    const oIcon = parentEl?.querySelector('.icon-tpl');
    oIcon?.remove();
  },
};
