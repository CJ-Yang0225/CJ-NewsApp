import './NewsCard.scss';
import NewsCardTpl from './NewsCard.tpl';
import Bookmark from '../Bookmark';
import { createFragment, injectTpl } from '../../utils';
import { BOOKMARKS_ITEM } from '../../constants/news';

class NewsCard {
  constructor({
    page,
    index,
    url,
    urlToImage,
    title,
    description,
    source,
    author,
    publishedAt,
    isMarked,
  }) {
    const bookmark = new Bookmark({
      isMarked,
      className: ' news-card__bookmark',
    });

    this.tpl = injectTpl(NewsCardTpl, {
      page,
      index,
      url,
      urlToImage: urlToImage || '',
      title,
      description: description || '',
      source: source || '',
      author: author || '',
      hasSource: source ? '' : 'display: none;',
      hasAuthor: author ? '' : 'display: none;',
      publishedAt,
      Bookmark: bookmark.tpl,
    });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }

  static createList(data, page = 0) {
    data = data || [];
    const newsCardListTpl = data.reduce((newsCardTplFrag, news, index) => {
      const {
        url,
        urlToImage,
        title,
        description,
        source,
        author,
        publishedAt,
      } = news;

      const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_ITEM)) || [];

      const NewsCard = this;

      const newsCard = new NewsCard({
        page,
        index,
        url,
        urlToImage,
        title,
        description,
        source: source.name,
        author,
        publishedAt: new Date(publishedAt).toLocaleString(),
        isMarked: bookmarks.some((bookmark) => bookmark.url === url),
      });

      return newsCardTplFrag + newsCard.tpl;
    }, '');

    return createFragment(newsCardListTpl);
  }

  static triggerImagesFadeIn(page = 0) {
    const oImages = document.querySelectorAll(
      `.news-card[data-page="${page}"] .news-card__thumbnail`
    );
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
  }
}

export default NewsCard;
