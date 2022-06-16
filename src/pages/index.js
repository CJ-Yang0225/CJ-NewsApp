import Header from '../components/Header';
import Navbar from '../components/Navbar';

const store = {
  category: 'top',
};

(function (doc) {
  const oApp = doc.getElementById('app');

  const init = () => {
    render();
    useEvent();
  };

  init();

  function render() {
    const { category } = store;

    const headerTpl = Header.setProps({
      title: '頭條新聞',
      backUrl: 'javascript:;',
      showBackIcon: false,
      showCollectionIcon: true,
    });
    const navbarTpl = Navbar.setProps({ activatedCategory: category });

    oApp.innerHTML += headerTpl + navbarTpl;
  }

  function useEvent() {
    Navbar.onSwitch(switchCategory);
  }

  function switchCategory(category) {
    store.category = category;
  }
})(document);
