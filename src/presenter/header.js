import InfoView from '../view/info';
import CostView from '../view/cost';
import NewButtonView from '../view/new-button';
import TabsView from '../view/tabs';
import FiltersView from '../view/filters';
import {RenderPosition} from '../const';
import {Render} from '../utils';

export default class HeaderPresenter {
  constructor(headerContainer, pointsModel) {
    this._headerContainer = headerContainer;
    this._controlsElement = headerContainer.querySelector(`.trip-controls`);
    this._headingElement = this._controlsElement.querySelector(`h2`);
    this._pointsModel = pointsModel;

    this._infoComponent = null;
    this._costComponent = null;
    this._newButtonComponent = new NewButtonView();
    this._tabsComponent = new TabsView();
    this._filtersComponent = new FiltersView();
  }

  init() {
    Render.render(this._headingElement, this._tabsComponent, RenderPosition.AFTEREND);
    Render.render(this._headerContainer, this._newButtonComponent);

    this._renderInfo(this._getPoints());
    Render.render(this._controlsElement, this._filtersComponent);
  }

  _getPoints() {
    return this._pointsModel.getPoints().slice();
  }

  _renderInfo(points) {
    const infoComponent = new InfoView(points);
    Render.render(this._headerContainer, infoComponent, RenderPosition.AFTERBEGIN);
    Render.render(infoComponent, new CostView(points));
  }
}
