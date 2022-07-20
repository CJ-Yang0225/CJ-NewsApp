class EventStore {
  _removedCallbacks = [];

  /**
   * @template {string} T
   * @param {EventTarget} eventTarget
   * @param {T} type
   * @param {(event: HTMLElementEventMap[T]) => void } linstener
   */
  add(eventTarget, type, linstener) {
    eventTarget.addEventListener(type, linstener);
    this._removedCallbacks.push(() => {
      eventTarget.removeEventListener(type, linstener);
    });
  }

  clean() {
    this._removedCallbacks.forEach((callback) => callback());
    this._removedCallbacks.length = 0;
  }
}

const debounce = (func, wait = 250, immediate = true) => {
  let timeoutId = null;

  return function () {
    if (immediate && !timeoutId) func.apply(this, arguments);

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func.apply(this, arguments);
    }, wait);
  };
};

const throttle = (func, wait = 250) => {
  let prevNow = 0;
  let timeoutId = null;

  return function () {
    const now = Date.now();
    const remaining = wait - (now - prevNow);

    clearTimeout(timeoutId);

    if (now - prevNow >= wait) {
      prevNow = now;
      func.apply(this, arguments);
    } else {
      timeoutId = setTimeout(() => {
        func.apply(this, arguments);
        prevNow = now;
        timeoutId = null;
      }, remaining);
    }
  };
};

export { debounce, throttle };

export default EventStore;
