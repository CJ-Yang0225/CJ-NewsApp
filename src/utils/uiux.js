const scrollToTop = () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 0);
};

const delay = (ms) => ({
  then: (callback) => {
    setTimeout(callback, ms);
  },
});

export {
  scrollToTop,
  delay,
};
