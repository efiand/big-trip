import AbstractView from './abstract';

const createPointsListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class PointsListView extends AbstractView {
  getTemplate() {
    return createPointsListTemplate();
  }
}
