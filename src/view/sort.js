import {Utils} from '../utils';
import AbstractView from '../view/abstract';
import {SORTINGS} from '../const';

const defaultSorting = SORTINGS[0];
const DISABLED_SORTINGS = [`point`, `offer`];

const createListMarkup = (activeSorting) => SORTINGS.reduce((markup, sorting) => {
  const title = Utils.capitalize(sorting);
  const isActive = sorting === activeSorting;
  const isDisabled = DISABLED_SORTINGS.indexOf(sorting) > -1;

  return `
    ${markup}
    <div class="trip-sort__item trip-sort__item--${sorting}">
      <input
        id="sort-${sorting}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${sorting}"
        ${isActive ? `checked` : ``}
        ${isDisabled ? `disabled` : ``}
      />
      <label class="trip-sort__btn" for="sort-${sorting}">
        ${title}
      </label>
    </div>
  `;
}, ``);

const createSortingsTemplate = (activeSorting) => {
  return `
    <form class="trip-events__trip-sort trip-sort" action="#" method="get">
      ${createListMarkup(activeSorting)}
    </form>
  `;
};

export default class SortingsView extends AbstractView {
  constructor(activeSorting = defaultSorting) {
    super();

    this._activeSorting = activeSorting;
  }

  getTemplate() {
    return createSortingsTemplate(this._activeSorting);
  }
}
