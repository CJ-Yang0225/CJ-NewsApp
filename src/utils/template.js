/**
 * @template {string} T
 * @param {T} template
 * @param {Object.<string, string>} data
 * @returns {T}
 */
const injectTpl = (template, data) => {
  return template.replace(/\s*\{\{(.*?)\}\}\s*/g, (_, key) => {
    return data[key.trim()];
  });
};

export { injectTpl };
