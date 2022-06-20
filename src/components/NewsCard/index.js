import './NewsCard.scss';
import NewsCardTpl from './NewsCard.tpl';
import { injectTpl } from '../../utils';

export default {
  name: 'NewsCard',
  setProps(props) {
    const { urlToImage, title, source, author, publishedAt, isCollected } =
      props;

    return injectTpl(NewsCardTpl, {
      urlToImage,
      title,
      source,
      author,
      publishedAt,
      isCollected: isCollected ? 'bookmark_added' : 'bookmark_border',
    });
  },
};
