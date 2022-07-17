import '@/styles/resets.css';
import '@/styles/border.css';
import '@/styles/globals.css';

document.documentElement.addEventListener(
  'touchmove',
  function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);
