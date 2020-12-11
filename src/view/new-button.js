import {createElement} from '../utils';

export const createNewButtonTemplate = () => {
  return `
    <button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
      New event
    </button>
  `;
};

export default class NewButtonView {
  getTemplate() {
    return createNewButtonTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
