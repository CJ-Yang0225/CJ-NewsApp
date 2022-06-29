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

export default EventStore;
