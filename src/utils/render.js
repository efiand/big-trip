import {RenderPosition} from '../const';

const renderPositions = Object.values(RenderPosition);

export const renderElement = (container, element, place = RenderPosition.BEFOREEND) => {
  if (renderPositions.indexOf(place) > -1) {
    container.insertAdjacentElement(place, element);
  }
};

export const renderTemplate = (container, template, place = RenderPosition.BEFOREEND) => {
  if (renderPositions.indexOf(place) > -1) {
    container.insertAdjacentHTML(place, template);
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template.trim();

  return newElement.firstChild;
};
