/**
 * @typedef {string} Tpl
 * @param {Tpl} Template
 * @param {Object.<string, string>} data
 * @returns {Tpl} injectedTemplate
 */
const injectTpl = (Template, data) => {
  return Template.replace(/\s*\{\{(.*?)\}\}\s*/g, (_, key) => {
    return data[key.trim()];
  });
};

export { injectTpl };
