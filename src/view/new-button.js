import AbstractView from '../view/abstract';

export const createNewButtonTemplate = () => {
  return `
    <button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">
      New event
    </button>
  `;
};

export default class NewButtonView extends AbstractView {
  getTemplate() {
    return createNewButtonTemplate();
  }
}
