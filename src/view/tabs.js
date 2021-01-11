import {capitalize} from '../utils/common';
import {createElement} from '../utils/render';

const TABS = [`table`, `stats`];
const defaultTab = TABS[0];

const createTabsTemplate = (activeTab) => {
  const tabsList = TABS.reduce((markup, tab) => {
    const activeClass = tab === activeTab ? `trip-tabs__btn--active` : ``;

    return `
      ${markup}
      <a class="trip-tabs__btn ${activeClass}" href="#">
        ${capitalize(tab)}
      </a>
    `;
  }, ``);

  return `
    <nav class="trip-controls__trip-tabs trip-tabs">
      ${tabsList}
    </nav>
  `;
};

export default class TabsView {
  constructor(activeTab = defaultTab) {
    this._activeTab = activeTab;
  }

  getTemplate() {
    return createTabsTemplate(this._activeTab);
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
