import NewButtonView from './view/new-button-view';
import TabsView from './view/tabs-view';
import StatsView from './view/stats-view';
import InfoPresenter from './presenter/info-presenter';
import FilterPresenter from './presenter/filter-presenter';
import TripPresenter from './presenter/trip-presenter';
import FilterModel from './model/filter-model';
import PointsModel from './model/points-model';
import Api from './api/api';
import Store from './api/store';
import Provider from './api/provider';
import {Render} from './utils';
import {RenderPosition, UpdateType} from './const';

const AUTHORIZATION = `Basic 68cefd64e8df947e825f4b4fa6cfe83d16ddb137`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v13`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripHeaderElement.querySelector(`.trip-controls`);
const tripHeadingElement = tripControlsElement.querySelector(`h2`);
const tripMainElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filterModel = new FilterModel();
const pointsModel = new PointsModel();

const newButtonComponent = new NewButtonView();
const tabsComponent = new TabsView();
const infoPresenter = new InfoPresenter(tripHeaderElement, pointsModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripMainElement, pointsModel, filterModel, apiWithProvider);

Render.render(tripHeadingElement, tabsComponent, RenderPosition.AFTEREND);
Render.render(tripHeaderElement, newButtonComponent);

tripPresenter.init(newButtonComponent, tabsComponent, new StatsView(), filterPresenter);
infoPresenter.init();
filterPresenter.init();

apiWithProvider.getAssets()
  .then((assets) => {
    if (!assets.pointTypes || !assets.destinations) {
      tripPresenter.stop(`No assets - no app!`);
    }

    pointsModel.setAssets(assets);
    apiWithProvider.getPoints()
      .then((points) => {
        pointsModel.setPoints(UpdateType.INIT, points);
        filterPresenter.init();
      }, () => {
        pointsModel.setPoints(UpdateType.INIT, []);
      });
  })
  .catch(tripPresenter.stop);

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (apiWithProvider.isNotSync) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
