import Header from '../components/Header';

(function (doc) {
  const oApp = doc.getElementById('app');

  const init = () => {
    render();
  };

  function render() {
    const headerTpl = Header.create({
      title: '已收藏的新聞',
      backUrl: './index.html',
      showBackIcon: true,
      showCollectionIcon: false,
    });

    oApp.innerHTML += headerTpl;
  }

  init();
})(document);
