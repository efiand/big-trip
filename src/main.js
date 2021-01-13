import HeaderPresenter from './presenter/header';
import TripPresenter from './presenter/trip';
import {generatePoint} from './mock/point';
import {Random} from './utils';

const POINTS_RANGE = [15, 20];
const pointsCount = Random.getInt(...POINTS_RANGE);
const points = new Array(pointsCount).fill().map(generatePoint);

const headerPresenter = new HeaderPresenter(document.querySelector(`.trip-main`));
headerPresenter.init(points);

const tripPresenter = new TripPresenter(document.querySelector(`.trip-events`));
tripPresenter.init(points);
