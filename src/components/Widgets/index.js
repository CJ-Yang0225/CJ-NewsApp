import './Widgets.scss';
import WidgetsTpl from './Widgets.tpl';
import { createFragment, injectTpl, scrollToTop } from '../../utils';

const toggleTheme = (event) => {
  const colorScheme = event.currentTarget.checked ? 'dark' : 'light';
  const oRoot = document.documentElement;

  oRoot.className = colorScheme;
};

class Widgets {
  constructor({ className = '' } = {}) {
    this.tpl = injectTpl(WidgetsTpl, { className });
    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;

    const oToggleThemeCheckbox = this.el.querySelector(
      '.toggle-theme__checkbox'
    );
    const oBackToTop = this.el.querySelector('.back-to-top');

    oToggleThemeCheckbox.checked = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    oToggleThemeCheckbox.addEventListener('change', toggleTheme);
    oBackToTop.addEventListener('click', () => scrollToTop(window.oApp, 100));
  }
}

export default Widgets;
