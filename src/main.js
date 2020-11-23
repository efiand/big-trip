import {createInfoTemplate} from './view/info';
import {createCostTemplate} from './view/cost';
import {createTabsTemplate} from './view/tabs';
import {createFiltersTemplate} from './view/filters';
import {createNewButtonTemplate} from './view/new-button';
import {createSortTemplate} from './view/sort';
import {createEventTemplate} from './view/event';
import {createEventEditTemplate} from './view/event-edit';

const EVENTS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.trip-main`);
render(headerElement, createInfoTemplate(), `afterbegin`);

const controlsElement = headerElement.querySelector(`.trip-controls`);
render(controlsElement, createFiltersTemplate());
render(controlsElement, createNewButtonTemplate(), `afterend`);

const switchHeadingElement = controlsElement.querySelector(`h2:first-child`);
render(switchHeadingElement, createTabsTemplate(), `afterend`);

const infoElement = headerElement.querySelector(`.trip-info`);
render(infoElement, createCostTemplate());

const listElement = document.querySelector(`.trip-events__list`);
render(listElement, createSortTemplate(), `beforebegin`);
render(listElement, createEventEditTemplate());

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(listElement, createEventTemplate());
}
