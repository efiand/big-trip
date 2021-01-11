import {shuffle} from './common';

export const getRandomInt = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItem = (list) => {
  const randomIndex = getRandomInt(0, list.length - 1);

  return list[randomIndex];
};

export const getRandomItems = (list, length = 0) => {
  return shuffle(Array.from(list)).slice(0, length);
};
