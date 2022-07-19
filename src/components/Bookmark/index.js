import './Bookmark.scss';
import BookmarkTpl from './Bookmark.tpl';
import { createFragment, injectTpl } from '../../utils';

class Bookmark {
  constructor({ isMarked, className = '' }) {
    this.tpl = injectTpl(BookmarkTpl, {
      className,
      checked: isMarked ? 'checked' : '',
    });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }
}

export default Bookmark;
