import '@/styles/resets.css';
import '@/styles/border.css';
import '@/styles/globals.scss';

import FastClick from './fastclick';

console.log('common loaded');

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
  false
);

document.documentElement.style.fontSize =
  document.documentElement.clientWidth / 37.5 + 'px'; // iPhone6: 375 x 667
