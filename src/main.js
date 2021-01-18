import NewButtonView from './view/new-button';
import TabsView from './view/tabs';
import InfoPresenter from './presenter/info';
import FilterPresenter from './presenter/filter';
import TripPresenter from './presenter/trip';
import FilterModel from './model/filter';
import PointsModel from './model/points';
import {generatePoint} from './mock/point';
import {Random, Render} from './utils';
import {RenderPosition} from './const';

const POINTS_RANGE = [15, 20];
const pointsCount = Random.getInt(...POINTS_RANGE);
const points = new Array(pointsCount).fill().map(generatePoint);

const filterModel = new FilterModel();
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripHeaderElement.querySelector(`.trip-controls`);
const tripHeadingElement = tripControlsElement.querySelector(`h2`);
const tripMainElement = document.querySelector(`.trip-events`);

const newButtonComponent = new NewButtonView();
const tabsComponent = new TabsView();

const infoPresenter = new InfoPresenter(tripHeaderElement, pointsModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);
const tripPresenter = new TripPresenter(tripMainElement, pointsModel, filterModel);

Render.render(tripHeadingElement, tabsComponent, RenderPosition.AFTEREND);
Render.render(tripHeaderElement, newButtonComponent);

infoPresenter.init();
filterPresenter.init();
tripPresenter.init(newButtonComponent);
