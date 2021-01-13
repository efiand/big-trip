import InfoView from '../view/info';
import CostView from '../view/cost';
import NewButtonView from '../view/new-button';
import TabsView from '../view/tabs';
import FiltersView from '../view/filters';
import {RenderPosition} from '../const';
import {Render} from '../utils';

export default class HeaderPresenter {
  constructor(headerContainer) {
    this._headerContainer = headerContainer;
    this._controlsElement = headerContainer.querySelector(`.trip-controls`);
    this._headingElement = this._controlsElement.querySelector(`h2`);

    this._infoComponent = null;
    this._costComponent = null;
    this._newButtonComponent = new NewButtonView();
    this._tabsComponent = new TabsView();
    this._filtersComponent = new FiltersView();

    this._points = [];
  }

  init(points) {
    this._points = points.slice();
    this._infoComponent = new InfoView(this._points);
    this._costComponent = new CostView(this._points);

    Render.render(this._headingElement, this._tabsComponent, RenderPosition.AFTEREND);
    Render.render(this._headerContainer, this._newButtonComponent);

    this._renderHeader();
  }

  _renderHeader() {
    Render.render(this._headerContainer, this._infoComponent, RenderPosition.AFTERBEGIN);
    Render.render(this._infoComponent, this._costComponent);
    Render.render(this._controlsElement, this._filtersComponent);
  }
}
