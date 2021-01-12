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
import {render, replace} from './utils/render';

const EVENTS_RANGE = [15, 20];
const eventsCount = getRandomInt(...EVENTS_RANGE);
const events = new Array(eventsCount).fill().map(generateEvent);

const headerMainElement = document.querySelector(`.trip-main`);
const infoComponent = new InfoView(events);
render(infoComponent, new CostView(events));
render(headerMainElement, new NewButtonView());
render(headerMainElement, infoComponent, RenderPosition.AFTERBEGIN);

const controlsElement = headerMainElement.querySelector(`.trip-controls`);
render(controlsElement.querySelector(`h2`), new TabsView(), RenderPosition.AFTEREND);
render(controlsElement, new FiltersView());

const eventsElement = document.querySelector(`.trip-events`);
if (eventsCount) {
  render(eventsElement, new SortingsView());

  const ListCompoment = new EventsListView();
  render(eventsElement, ListCompoment);

  events.forEach((eventData) => {
    const eventComponent = new EventView(eventData);
    const eventEditComponent = new EventEditView({
      eventData,
      eventTypes,
      destinations,
      cities: CITY_NAMES
    });

    const switchToEdit = () => {
      replace(eventEditComponent, eventComponent);
      document.addEventListener(`keydown`, escKeyDownHandler);
    };
    const switchToView = () => {
      replace(eventComponent, eventEditComponent);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        switchToView();
      }
    };

    eventComponent.setClickHandler(switchToEdit);

    eventEditComponent.setSubmitHandler(() => {
      switchToView();
    });
    eventEditComponent.setResetHandler(() => {
      switchToView();
    });
    eventEditComponent.setCloseHandler(switchToView);

    render(ListCompoment, eventComponent);
  });
} else {
  render(eventsElement, new NoEventsView());
}
