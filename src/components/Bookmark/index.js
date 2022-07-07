import './Bookmark.scss';
import BookmarkTpl from './Bookmark.tpl';
import { injectTpl } from '../../utils';

export default {
  name: 'Bookmark',
  create(props) {
    const { isMarked, className = '' } = props;

    return injectTpl(BookmarkTpl, {
      className,
      checked: isMarked ? 'checked' : '',
    });
  },
};
