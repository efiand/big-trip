import HeaderPresenter from './presenter/header';
import TripPresenter from './presenter/trip';
import PointsModel from './model/points';
import {generatePoint} from './mock/point';
import {Random} from './utils';

const POINTS_RANGE = [15, 20];
const pointsCount = Random.getInt(...POINTS_RANGE);
const points = new Array(pointsCount).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const headerPresenter = new HeaderPresenter(document.querySelector(`.trip-main`), pointsModel);
headerPresenter.init();

const tripPresenter = new TripPresenter(document.querySelector(`.trip-events`), pointsModel);
tripPresenter.init();
