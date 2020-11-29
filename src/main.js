import {getRandomInt} from './utils';
import {createInfoTemplate} from './view/info';
import {createCostTemplate} from './view/cost';
import {createTabsTemplate} from './view/tabs';
import {createFiltersTemplate} from './view/filters';
import {createNewButtonTemplate} from './view/new-button';
import {createSortTemplate} from './view/sort';
import {createEventsListTemplate} from './view/events-list';
import {createEventTemplate} from './view/event';
import {createEventEditTemplate} from './view/event-edit';
import {generateEvent} from './mock/event';
import {eventTypes} from './mock/event-types';
import {destinations} from './mock/destinations';
import {CITY_NAMES} from './mock/const';

const EVENTS_RANGE = [15, 20];
const eventsCount = getRandomInt(...EVENTS_RANGE);
const events = new Array(eventsCount).fill().map(generateEvent);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.trip-main`);
render(headerElement, createInfoTemplate(events), `afterbegin`);

const controlsElement = headerElement.querySelector(`.trip-controls`);
render(controlsElement, createFiltersTemplate());
render(controlsElement, createNewButtonTemplate(), `afterend`);

const switchHeadingElement = controlsElement.querySelector(`h2:first-child`);
render(switchHeadingElement, createTabsTemplate(), `afterend`);

const infoElement = headerElement.querySelector(`.trip-info`);
render(infoElement, createCostTemplate(events));

const eventsElement = document.querySelector(`.trip-events`);
render(eventsElement, createSortTemplate());

render(eventsElement, createEventsListTemplate(eventsCount));
if (eventsCount) {
  const listElement = eventsElement.querySelector(`.trip-events__list`);

  events.forEach((eventData, i) => {
    render(listElement, i ? createEventTemplate(eventData) : createEventEditTemplate({
      eventData,
      eventTypes,
      destinations,
      cities: CITY_NAMES
    }));
  });
}
