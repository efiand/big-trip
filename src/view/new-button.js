import AbstractView from './abstract';

export const createNewButtonTemplate = () => {
  return `
    <button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
      New event
    </button>
  `;
};

export default class NewButtonView extends AbstractView {
  constructor() {
    super();

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNewButtonTemplate();
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }
}
