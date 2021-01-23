import {Utils} from '../utils';
import AbstractView from '../view/abstract';

const Tabs = {
  TABLE: `table`,
  STATS: `stats`
};

const createTabsTemplate = (activeTab) => {
  const tabsList = Object.values(Tabs).reduce((markup, tab) => {
    const activeClass = tab === activeTab ? `trip-tabs__btn--active` : ``;

    return `
      ${markup}
      <a class="trip-tabs__btn ${activeClass}" href="#">
        ${Utils.capitalize(tab)}
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
  constructor(activeTab = Tabs.TABLE) {
    super();

    this._activeTab = activeTab;
  }

  getTemplate() {
    return createTabsTemplate(this._activeTab);
  }
}
