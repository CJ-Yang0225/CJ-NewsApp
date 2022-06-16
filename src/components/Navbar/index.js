import './Navbar.scss';
import NavbarTpl from './NavBar.tpl';
import LabelTpl from './Label.tpl';
import { injectTpl } from '../../utils';
import { NEWS_CATEGORIES as labels } from '../../data';

export default {
  name: 'Navbar',
  state: { labelIndex: -1 },
  setProps(props) {
    const { activatedCategory } = props;

    const oRoot = document.querySelector(':root');
    oRoot.style.setProperty('--labels-length', labels.length);
    this.state.labelIndex = labels.findIndex(
      (label) => label.category === activatedCategory
    );

    const labelsTpl = labels.reduce((labelTpl, label) => {
      const currentLabelTpl = injectTpl(LabelTpl, {
        ...label,
        isActivated:
          label.category === activatedCategory
            ? 'navbar__label--activated'
            : '',
      });

      return labelTpl + currentLabelTpl;
    }, '');

    return injectTpl(NavbarTpl, {
      labelsTpl,
    });
  },

  onSwitch(emitSwitch) {
    const oNavbar = document.querySelector('.navbar');
    const oLabels = oNavbar.querySelectorAll('.navbar__label');
    const handleSwitch = (event) => {
      const target = event.target;

      if (target.classList.contains('navbar__label')) {
        const currentIndex = this.state.labelIndex;
        const nextIndex = Array.from(oLabels).indexOf(target);

        if (currentIndex !== nextIndex) {
          this.state.labelIndex = nextIndex;
          oLabels[currentIndex].classList.remove('navbar__label--activated');
          target.classList.add('navbar__label--activated');
          emitSwitch(target.dataset.category);
        }
      }
    };

    oNavbar.addEventListener('click', handleSwitch);
  },
};
