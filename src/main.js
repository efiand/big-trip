import NewButtonView from './view/new-button';
import TabsView from './view/tabs';
import StatsView from './view/stats';
import InfoPresenter from './presenter/info';
import FilterPresenter from './presenter/filter';
import TripPresenter from './presenter/trip';
import FilterModel from './model/filter';
import PointsModel from './model/points';
import Api from './api';
import {Render} from './utils';
import {RenderPosition} from './const';

const AUTHORIZATION = `Basic 68cefd64e8df947e825f4b4fa6cfe83d16ddb137`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripHeaderElement.querySelector(`.trip-controls`);
const tripHeadingElement = tripControlsElement.querySelector(`h2`);
const tripMainElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);
const filterModel = new FilterModel();
const pointsModel = new PointsModel();
const newButtonComponent = new NewButtonView();
const tabsComponent = new TabsView();
const statsComponent = new StatsView();
const infoPresenter = new InfoPresenter(tripHeaderElement, pointsModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripMainElement, pointsModel, filterModel);

Render.render(tripHeadingElement, tabsComponent, RenderPosition.AFTEREND);
Render.render(tripHeaderElement, newButtonComponent);

api.getData().then((data) => {
  pointsModel.setData(data);

  infoPresenter.init();
  filterPresenter.init();
  tripPresenter.init(newButtonComponent, tabsComponent, statsComponent);
});
