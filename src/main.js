import InfoView from './view/info';
import NewButtonView from './view/new-button';
import TabsView from './view/tabs';
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

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const filterModel = new FilterModel();

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripHeaderElement.querySelector(`.trip-controls`);
const tripHeadingElement = tripControlsElement.querySelector(`h2`);

Render.render(tripHeaderElement, new InfoView(points), RenderPosition.AFTERBEGIN);
Render.render(tripHeadingElement, new TabsView(), RenderPosition.AFTEREND);
Render.render(tripHeaderElement, new NewButtonView());

const filterPresenter = new FilterPresenter(tripControlsElement, filterModel);
const tripPresenter = new TripPresenter(document.querySelector(`.trip-events`), pointsModel, filterModel);

filterPresenter.init();
tripPresenter.init();
