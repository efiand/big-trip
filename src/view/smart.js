import AbstractView from './abstract';

export default class SmartView extends AbstractView {
  constructor() {
    super();
    this._data = {};
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: restoreHandlers`);
  }

  updateData(update, callback = this.updateELement) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (callback) {
      callback.bind(this)();
    }
  }

  updateELement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }
}
