/**
 * MDN - DocumentFragment
 *
 * https://developer.mozilla.org/zh-TW/docs/Web/API/DocumentFragment
 * @param {string} htmlString
 * @returns {DocumentFragment} documentFragment node(s)
 */
const createFragment = (htmlString) => {
  const templateElement = document.createElement('template');
  templateElement.innerHTML = htmlString;

  return templateElement.content;
};

const scrollToTop = (targetEl = window.oApp, delay = 250) => {
  setTimeout(() => {
    targetEl.scrollTo({ top: 0, behavior: 'smooth' });
  }, delay);
};

const scrollByLength = (targetEl = window.oApp, direction = 'top', length) => {
  targetEl.scrollBy({
    [direction]: length,
    behavior: 'smooth',
  });
};

const delay = (ms) => ({
  then(callback) {
    setTimeout(callback, ms);
  },
});

const detectScrolledToBottom = (targetEl = window.oApp, threshold = 50) => {
  const viewedHeight = targetEl.scrollTop + targetEl.offsetHeight;
  const totalHeight = targetEl.scrollHeight;
  const hasScrollbar = totalHeight > targetEl.offsetHeight;
  const isScrolledToBottom = totalHeight - viewedHeight <= threshold;

  return hasScrollbar && isScrolledToBottom;
};

function getScrolledLength(element) {
  if (!element) {
    if (window.scrollX || window.pageXOffset) {
      // window.pageXOffset/pageYOffset is a legacy alias
      return {
        left: window.scrollX || window.pageXOffset,
        top: window.scrollY || window.pageYOffset,
      };
    }

    element =
      document.compatMode === 'BackCompat'
        ? document.body
        : document.documentElement;
  }

  return {
    left: element.scrollLeft,
    top: element.scrollTop,
  };
}

function getViewportSize() {
  if (document.compatMode === 'BackCompat') {
    // In quirks mode
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight,
    };
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  }
  // window.innerWidth/innerHeight includes the scrollbar.
}

function getDocumentSize() {
  // https://javascript.info/size-and-scroll-window#width-height-of-the-document
  const documentWidth = Math.max(
    document.documentElement.scrollWidth,
    document.body.scrollWidth,
    document.documentElement.offsetWidth,
    document.body.offsetWidth,
    document.documentElement.clientWidth,
    document.body.clientWidth
  );
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.body.clientHeight
  );

  return {
    width: documentWidth,
    height: documentHeight,
  };
}

export {
  createFragment,
  scrollToTop,
  scrollByLength,
  delay,
  getScrolledLength,
  getViewportSize,
  getDocumentSize,
  detectScrolledToBottom,
};
