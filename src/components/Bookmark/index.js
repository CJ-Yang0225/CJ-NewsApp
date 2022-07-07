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
      bookmarkIcon: isMarked ? 'bookmark_added' : 'bookmark_border',
    });
  },
  change(oBookmarkIcon, isMarked) {
    oBookmarkIcon.textContent = isMarked ? 'bookmark_added' : 'bookmark_border';
  },
};
