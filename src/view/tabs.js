import {capitalize} from '../utils/common';
import AbstractView from '../view/abstract';

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

export default class TabsView extends AbstractView {
  constructor(activeTab = defaultTab) {
    super();

    this._activeTab = activeTab;
  }

  getTemplate() {
    return createTabsTemplate(this._activeTab);
  }
}
