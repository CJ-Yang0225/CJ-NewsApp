import Header from '../components/Header';

(function (doc) {
  const oApp = doc.getElementById('app');

  const init = () => {
    render();
  };

  init();

  function render() {
    const headerTpl = Header.setProps({
      title: '頭條新聞',
      backUrl: 'javascript:;',
      showBackIcon: false,
      showCollectionIcon: true,
    });

    oApp.innerHTML += headerTpl;
  }
})(document);
