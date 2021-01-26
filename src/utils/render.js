import AbstractView from '../view/abstract';
import {RenderPosition} from '../const';

export default class Render {
  // Создаёт DOM-элемент из шаблона
  static createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template.trim();

    return newElement.firstChild;
  }

  // Добавляет в DOM-элемент потомка
  // Родитель и потомок могут быть переданы в виде компонента, DOM-элемента или строкового шаблона
  static render(container, child, place = RenderPosition.BEFOREEND) {
    if (container instanceof AbstractView) {
      container = container.getElement();
    }

    if (child instanceof AbstractView) {
      child = child.getElement();
    }

    container.insertAdjacentElement(place, child);
  }

  static replace(newChild, oldChild) {
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
  }

  static remove(component) {
    if (component === null) {
      return;
    }

    if (!(component instanceof AbstractView)) {
      throw new Error(`Can remove only components`);
    }

    component.getElement().remove();
    component.removeElement();
  }
}
