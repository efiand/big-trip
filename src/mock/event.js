import dayjs from 'dayjs';
import {getRandomInt, getRandomItem} from '../utils';
import {EVENT_TYPES, PRICE_RANGE, CITY_NAMES} from './const';
import {eventTypes} from './event-types';
import {destinations} from './destinations';

const DURATION_RANGE = [10, 60 * 24 * 3]; // для выбора случайной длительности от 10 мин. до 3 сут.
const MINUTE_NAME = `minute`;
let tempTime = dayjs().add(getRandomInt(...DURATION_RANGE), MINUTE_NAME);
let counter = 0;

export const generateEvent = () => {
  // Начало следующего мероприятия совпадает с окончанием ранее сгенерированного
  // Поэтому сохраняем значение из счетчика времени
  const startTime = tempTime.toISOString();

  // Добавляем к счетчику времени случайную продолжительность
  tempTime = tempTime.add(getRandomInt(...DURATION_RANGE), MINUTE_NAME);

  const typeName = getRandomItem(EVENT_TYPES);
  const cityName = getRandomItem(CITY_NAMES);
  const type = JSON.parse(JSON.stringify(eventTypes.find(({name}) => name === typeName)));
  type.offers.forEach((offer) => {
    offer.isChecked = Boolean(getRandomInt());
  });

  return {
    id: ++counter,
    type,
    destination: destinations.find(({city}) => city === cityName),
    startTime,
    finishTime: tempTime.toISOString(),
    isFavorite: Boolean(getRandomInt()),
    price: getRandomInt(...PRICE_RANGE)
  };
};
