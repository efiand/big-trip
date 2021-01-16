import {Random} from '../utils';
import {POINT_TYPES, PRICE_RANGE} from './const';

const OFFER_NAMES = [
  `Order Uber`,
  `Add luggage`,
  `Switch to comfort`,
  `Rent a car`,
  `Add breakfast`,
  `Book tickets`,
  `Lunch in city`,
  `Choose seats`
];
const OFFERS_COUNT_RANGE = [0, 5];

export const pointTypes = POINT_TYPES.map((typeName) => {
  const offerNames = Random.getItems(OFFER_NAMES, Random.getInt(...OFFERS_COUNT_RANGE));

  return {
    name: typeName,
    offers: offerNames.map((name) => ({
      name,
      alias: name.slice(name.lastIndexOf(` `)).toLowerCase().trim(),
      price: Random.getInt(...PRICE_RANGE),
      isChecked: false
    }))
  };
});
