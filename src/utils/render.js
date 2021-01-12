import AbstractView from '../view/abstract';
import {RenderPosition} from '../const';

// Создаёт DOM-элемент из шаблона
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template.trim();

  return newElement.firstChild;
};

// Добавляет в DOM-элемент потомка
// Родитель и потомок могут быть переданы в виде компонента, DOM-элемента или строкового шаблона
export const render = (container, child, place = RenderPosition.BEFOREEND) => {
  if (Object.values(RenderPosition).indexOf(place) === -1) {
    return;
  }

  if (container instanceof AbstractView) {
    container = container.getElement();
  } else if (typeof container === `string`) {
    container = createElement(container);
  }

  if (typeof child === `string`) {
    container.insertAdjacentHTML(place, child);
  } else {
    if (child instanceof AbstractView) {
      child = child.getElement();
    }

    container.insertAdjacentElement(place, child);
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (!parent || !oldChild || !newChild) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};
