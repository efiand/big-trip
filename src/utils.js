import {RenderPosition} from './const';

export const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItem = (list) => {
  const randomIndex = getRandomInt(0, list.length - 1);

  return list[randomIndex];
};

// Делает первую букву заглавной
export const capitalize = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

// Перемешивает массив по алгоритму Фишера—Йетса.
export const shuffle = (array) => {
  const resultArray = array.slice();
  for (let i = resultArray.length - 1; i > 0; i--) {
    const randomNumber = Math.floor(Math.random() * (i + 1));
    [resultArray[randomNumber], resultArray[i]] = [resultArray[i], resultArray[randomNumber]];
  }

  return resultArray;
};

export const getRandomItems = (list, length = 0) => {
  return shuffle(Array.from(list)).slice(0, length);
};

// Выводит число с ведущим нулём
const TWO_DIGIT = 10;
export const formatWithLead0 = (num) => `${num < TWO_DIGIT ? 0 : ``}${num}`;

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
