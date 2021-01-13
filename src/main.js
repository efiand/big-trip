import InfoView from './view/info';
import CostView from './view/cost';
import TabsView from './view/tabs';
import FiltersView from './view/filters';
import NewButtonView from './view/new-button';
import SortingsView from './view/sort';
import PointsListView from './view/points-list';
import NoPointsView from './view/no-points';
import PointView from './view/point';
import PointEditView from './view/point-edit';

import {generatePoint} from './mock/point';
import {pointTypes} from './mock/point-types';
import {destinations} from './mock/destinations';
import {CITY_NAMES} from './mock/const';

import {RenderPosition} from './const';
import {Random, Render} from './utils';

const POINTS_RANGE = [15, 20];
const pointsCount = Random.getInt(...POINTS_RANGE);
const points = new Array(pointsCount).fill().map(generatePoint);

const headerMainElement = document.querySelector(`.trip-main`);
const infoComponent = new InfoView(points);
Render.render(infoComponent, new CostView(points));
Render.render(headerMainElement, new NewButtonView());
Render.render(headerMainElement, infoComponent, RenderPosition.AFTERBEGIN);

const controlsElement = headerMainElement.querySelector(`.trip-controls`);
Render.render(controlsElement.querySelector(`h2`), new TabsView(), RenderPosition.AFTEREND);
Render.render(controlsElement, new FiltersView());

const pointsElement = document.querySelector(`.trip-events`);
if (pointsCount) {
  Render.render(pointsElement, new SortingsView());

  const ListCompoment = new PointsListView();
  Render.render(pointsElement, ListCompoment);

  points.forEach((pointData) => {
    const pointComponent = new PointView(pointData);
    const pointEditComponent = new PointEditView({
      pointData,
      pointTypes,
      destinations,
      cities: CITY_NAMES
    });

    const switchToEdit = () => {
      Render.replace(pointEditComponent, pointComponent);
      document.addEventListener(`keydown`, escKeyDownHandler);
    };
    const switchToView = () => {
      Render.replace(pointComponent, pointEditComponent);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        switchToView();
      }
    };

    pointComponent.setClickHandler(switchToEdit);

    pointEditComponent.setSubmitHandler(() => {
      switchToView();
    });
    pointEditComponent.setResetHandler(() => {
      switchToView();
    });
    pointEditComponent.setCloseHandler(switchToView);

    Render.render(ListCompoment, pointComponent);
  });
} else {
  Render.render(pointsElement, new NoPointsView());
}
