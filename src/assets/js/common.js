import '@/styles/resets.css';
import '@/styles/border.css';
import '@/styles/globals.css';

import FastClick from './fastclick';

window.addEventListener(
  'load',
  function () {
    FastClick.attach(document.body);
  },
  false
);

document.documentElement.addEventListener(
  'touchmove',
  function (e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);
