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

export { createFragment };
