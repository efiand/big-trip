import {Random} from '../utils';
import {CITY_NAMES} from './const';

const PHRASES_RANGE = [1, 5];
const PHOTOS_RANGE = [1, 5];
const PHOTONUMBERS_RANGE = [100, 500];
const PHOTOTITLE_RANGE = [10, 30];
const DESCRIPTION_PHRASES = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

export const destinations = CITY_NAMES.map((name) => ({
  name,
  description: new Array(Random.getInt(...PHRASES_RANGE)).fill().map(() => {
    return Random.getItem(DESCRIPTION_PHRASES);
  }).join(` `),
  pictures: new Array(Random.getInt(...PHOTOS_RANGE)).fill().map(() => {
    return {
      src: `http://picsum.photos/248/152?r=${Random.getInt(...PHOTONUMBERS_RANGE)}`,
      description: Random.getItem(DESCRIPTION_PHRASES).slice(0, Random.getInt(...PHOTOTITLE_RANGE))
    };
  })
}));
