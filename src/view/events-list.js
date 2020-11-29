export const createEventsListTemplate = (count) => {
  if (count) {
    return `<ul class="trip-events__list"></ul>`;
  }
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};
