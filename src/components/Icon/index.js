import './Icon.scss';
import IconTpl from './Icon.tpl';
import { injectTpl } from '../../utils';
import loadingIconUrl from '../../assets/images/loading.gif';

export default {
  name: 'Icon',
  setProps(props) {
    const { status, iconUrl } = props;

    return injectTpl(IconTpl, {
      iconUrl: iconUrl || loadingIconUrl,
      status: status ? ` icon-tpl--${status}` : '',
    });
  },
};
