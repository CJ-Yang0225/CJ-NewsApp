import './NewsCard.scss';
import NewsCardTpl from './NewsCard.tpl';
import { injectTpl } from '../../utils';

export default {
  name: 'NewsCard',
  setProps(props) {
    const {
      page,
      index,
      urlToImage,
      title,
      description,
      source,
      author,
      publishedAt,
      isCollected,
    } = props;

    return injectTpl(NewsCardTpl, {
      page,
      index,
      urlToImage: urlToImage || '',
      title,
      description: description || '',
      source: source || '',
      author: author || '',
      hasSource: source ? '' : 'display: none;',
      hasAuthor: author ? '' : 'display: none;',
      publishedAt,
      isCollected: isCollected ? 'bookmark_added' : 'bookmark_border',
    });
  },
  triggerImagesFadeIn() {
    const oImages = document.querySelectorAll('.news-card__thumbnail');
    oImages.forEach((oImage) => {
      // image is cached by browser
      if (oImage.complete) {
        oImage.style.animationPlayState = 'running';
      } else {
        oImage.onload = () => {
          oImage.style.animationPlayState = 'running';
        };
      }
    });
  },
};
