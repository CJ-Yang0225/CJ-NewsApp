function injectTpl(template, data) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return data[key.trim()];
  });
}

export { injectTpl };
