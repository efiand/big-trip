import SmartView from './smart';
import {Utils} from '../utils';
import {Tabs} from '../const';

const createTabsTemplate = (activeTab) => {
  const tabsList = Object.values(Tabs).reduce((markup, tab) => {
    const activeClass = tab === activeTab ? `trip-tabs__btn--active` : ``;

    return `
      ${markup}
      <a class="trip-tabs__btn ${activeClass}" href="#" data-tab="${tab}">
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

export default class TabsView extends SmartView {
  constructor(activeTab = Tabs.TABLE) {
    super();

    this._data.activeTab = activeTab;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createTabsTemplate(this._data.activeTab);
  }

  restoreHandlers() {
    this.setClickHandler(this._callback.click);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().addEventListener(`click`, this._clickHandler);
  }

  setDefault() {
    this.updateData({
      activeTab: Tabs.TABLE
    });
  }

  _clickHandler(evt) {
    evt.preventDefault();

    if (evt.target.tagName === `A`) {
      const activeTab = evt.target.dataset.tab;

      this._callback.click(activeTab);
      this.updateData({activeTab});
    }
  }
}
