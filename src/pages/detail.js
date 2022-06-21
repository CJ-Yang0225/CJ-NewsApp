import Header from '../components/Header';

(function (doc) {
  const oApp = doc.getElementById('app');

  const init = () => {
    render();
  };

  function render() {
    const headerTpl = Header.setProps({
      title: '新聞內容',
      backUrl: './index.html',
      showBackIcon: true,
      showCollectionIcon: true,
    });

    oApp.innerHTML += headerTpl;
  }

  init();
})(document);
