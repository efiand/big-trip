import InfoView from './view/info';
import CostView from './view/cost';
import TabsView from './view/tabs';
import FiltersView from './view/filters';
import NewButtonView from './view/new-button';
import SortingsView from './view/sort';
import EventsListView from './view/events-list';
import NoEventsView from './view/no-events';
import EventView from './view/event';
import EventEditView from './view/event-edit';

import {generateEvent} from './mock/event';
import {eventTypes} from './mock/event-types';
import {destinations} from './mock/destinations';
import {CITY_NAMES} from './mock/const';

import {RenderPosition} from './const';
import {getRandomInt} from './utils/random';
import {renderElement} from './utils/render';

const EVENTS_RANGE = [15, 20];
const eventsCount = getRandomInt(...EVENTS_RANGE);
const events = new Array(eventsCount).fill().map(generateEvent);

const headerMainElement = document.querySelector(`.trip-main`);
const infoComponent = new InfoView(events);
const infoElement = infoComponent.getElement();
renderElement(infoElement, new CostView(events).getElement());
renderElement(headerMainElement, new NewButtonView().getElement());
renderElement(headerMainElement, infoElement, RenderPosition.AFTERBEGIN);

const controlsElement = headerMainElement.querySelector(`.trip-controls`);
renderElement(controlsElement.querySelector(`h2`), new TabsView().getElement(), RenderPosition.AFTEREND);
renderElement(controlsElement, new FiltersView().getElement());

const eventsElement = document.querySelector(`.trip-events`);
if (eventsCount) {
  renderElement(eventsElement, new SortingsView().getElement());

  const listElement = new EventsListView().getElement();
  renderElement(eventsElement, listElement);

  events.forEach((eventData) => {
    const eventComponent = new EventView(eventData);
    const eventEditComponent = new EventEditView({
      eventData,
      eventTypes,
      destinations,
      cities: CITY_NAMES
    });

    const switchToEdit = () => {
      listElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
    };
    const switchToView = () => {
      listElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        switchToView();
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };
    const formCloseHandler = (evt) => {
      evt.preventDefault();
      switchToView();
    };

    eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      switchToEdit();
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    const form = eventEditComponent.getElement().querySelector(`form`);
    form.addEventListener(`submit`, formCloseHandler);
    form.addEventListener(`reset`, formCloseHandler);
    form.querySelector(`.event__rollup-btn`).addEventListener(`click`, formCloseHandler);

    renderElement(listElement, eventComponent.getElement());
  });
} else {
  renderElement(eventsElement, new NoEventsView().getElement());
}
