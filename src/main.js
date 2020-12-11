import {getRandomInt} from './utils';
import InfoView from './view/info';
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
import {renderTemplate, renderElement, RenderPosition} from './utils.js';

const EVENTS_RANGE = [15, 20];
const eventsCount = getRandomInt(...EVENTS_RANGE);
const events = new Array(eventsCount).fill().map(generateEvent);

const headerMainElement = document.querySelector(`.trip-main`);
console.log(new InfoView(events).getElement());
const infoComponent = new InfoView(events);
const infoElement = infoComponent.getElement();
renderTemplate(infoElement, createCostTemplate(events));
renderElement(headerMainElement, infoElement, RenderPosition.AFTERBEGIN);
renderTemplate(headerMainElement, createNewButtonTemplate());

const controlsElement = headerMainElement.querySelector(`.trip-controls`);
renderTemplate(controlsElement, createTabsTemplate());
renderTemplate(controlsElement, createFiltersTemplate());

const eventsElement = document.querySelector(`.trip-events`);
renderTemplate(eventsElement, createSortTemplate());

renderTemplate(eventsElement, createEventsListTemplate(eventsCount));
if (eventsCount) {
  const listElement = eventsElement.querySelector(`.trip-events__list`);

  events.forEach((eventData, i) => {
    renderTemplate(listElement, i ? createEventTemplate(eventData) : createEventEditTemplate({
      eventData,
      eventTypes,
      destinations,
      cities: CITY_NAMES
    }));
  });
}
