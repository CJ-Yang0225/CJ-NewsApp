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
    this.props = Object.defineProperty({}, 'activatedCategory', {
      get: () => {
        return activatedCategory;
      },
      set: (value) => {
        activatedCategory = value;
        this.updateUI();
      },
    });

    oApp.style.setProperty('--labels-length', NEWS_LABELS.length);

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

  updateUI() {
    const oNavbar = this.el;
    const oLabels = oNavbar.querySelectorAll('.navbar__label');
    oLabels.forEach((oLabel) =>
      oLabel.classList.remove('navbar__label--activated')
    );
    const oActivatedLabel = Array.from(oLabels).find(
      (oLabel) => oLabel.dataset.category === this.props.activatedCategory
    );
    oActivatedLabel.classList.add('navbar__label--activated');

    const oScrollableBox = oNavbar.firstElementChild;
    const distance =
      oActivatedLabel.offsetLeft -
      oActivatedLabel.offsetWidth -
      parseFloat(getComputedStyle(oActivatedLabel).marginLeft);
    oScrollableBox.scrollTo({ left: distance, behavior: 'smooth' });
  }

  onSwitch(emitSwitch) {
    const oNavbar = this.el;

    const handleClick = (event) => {
      const target = event.target;
      const targetCategory = target.dataset.category;

      if (target.classList.contains('navbar__label')) {
        if (targetCategory !== this.props.activatedCategory) {
          emitSwitch(targetCategory);
          setURLSearchParam('category', targetCategory);
        }

        scrollToTop(oApp);
      }
    };

    const handlePopstate = (event) => {
      this.props.activatedCategory = event.state?.category || 'top';
      emitSwitch(this.props.activatedCategory);
    };

    oNavbar.addEventListener('click', handleClick);
    window.addEventListener('popstate', handlePopstate);
  }
}

export default Navbar;
