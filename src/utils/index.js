function injectTpl(template, props) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return props[key.trim()];
  });
}

export { injectTpl };
