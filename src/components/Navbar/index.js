import './Navbar.scss';
import NavbarTpl from './Navbar.tpl';
import LabelTpl from './Label.tpl';
import {
  createFragment,
  injectTpl,
  scrollToTop,
  setURLSearchParam,
} from '../../utils';
import { NEWS_LABELS } from '../../constants/news';

class Navbar {
  constructor({ activatedCategory }) {
    const oApp = document.getElementById('app');
    oApp.style.setProperty('--labels-length', NEWS_LABELS.length);

    this.state = {
      activatedCategory,
    };

    const labelsTpl = NEWS_LABELS.reduce((labelsTplFrag, label) => {
      const labelTpl = injectTpl(LabelTpl, {
        ...label,
        isActivated:
          label.category === activatedCategory
            ? ' navbar__label--activated'
            : '',
      });

      return labelsTplFrag + labelTpl;
    }, '');

    this.tpl = injectTpl(NavbarTpl, { labelsTpl });

    const content = createFragment(this.tpl);
    this.el = content.firstElementChild;
  }

  onSwitch(emitSwitch) {
    const oNavbar = this.el;

    const updateUI = () => {
      const oLabels = oNavbar.querySelectorAll('.navbar__label');
      oLabels.forEach((oLabel) =>
        oLabel.classList.remove('navbar__label--activated')
      );
      const oActivatedLabel = Array.from(oLabels).find(
        (oLabel) => oLabel.dataset.category === this.state.activatedCategory
      );
      oActivatedLabel.classList.add('navbar__label--activated');
    };

    const handleClick = (event) => {
      const target = event.target;
      const targetCategory = target.dataset.category;

      if (target.classList.contains('navbar__label')) {
        if (targetCategory !== this.state.activatedCategory) {
          this.state.activatedCategory = targetCategory;
          setURLSearchParam('category', targetCategory);
          updateUI();
          emitSwitch(targetCategory);
        }

        scrollToTop();
      }
    };

    const handlePopstate = (event) => {
      this.state.activatedCategory = event.state?.category || 'top';

      updateUI();
      emitSwitch(this.state.activatedCategory);
    };

    oNavbar.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopstate);
  }
}

export default Navbar;
