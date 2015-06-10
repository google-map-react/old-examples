import immutable from 'immutable';

// really really nice but big size library
import {seed} from 'faker/vendor/mersenne.js';
import faker from 'faker';


const K_PITER_LAT_LNG = {lat: 59.938043, lng: 30.337157};

function imageRndUrl(width = 100, height = 75) {
  const categories = ['abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people', 'nature', 'sports', 'technics', 'transport'];
  const category = categories[faker.random.number({max: categories.length - 1})];
  const index = 1 + faker.random.number({max: 8});
  return `http://lorempixel.com/${width}/${height}/${category}/${index}/`;
}

// something like normal distribution around 0.5
function nLikeRnd() {
  const K_N = 10;
  let sum = 0;
  for (let i = 0; i < K_N; ++i) {
    sum += faker.random.number({max: 1, precision: 0.0001});
  }

  return sum / K_N;
}

export default function genMarkersData({count, seed: seedNumber, latVarM, lngVarM, test, typeGetter}) {
  seed(seedNumber);
  const K_P_COUNT = 10;
  const paragraphs = new immutable.Range(0, K_P_COUNT)
    .map(() => faker.lorem.paragraph())
    .toList()
    .toJS();

  let markersData = new immutable
    .Range(0, count)
    .map(i => new immutable.Map({
      id: 'uuid_' + i,
      lat: K_PITER_LAT_LNG.lat + (latVarM || 1.5) * (nLikeRnd() - 0.5),
      lng: K_PITER_LAT_LNG.lng + (lngVarM || 1.5) * (nLikeRnd() - 0.5),
      title: faker.company.companyName().toUpperCase(),
      description: paragraphs[i % K_P_COUNT],
      address: faker.address.streetAddress(),
      image: imageRndUrl(),
      type: (typeGetter ? typeGetter(i) : i % 2), // i % 4,
      number: `${20 + i}$`
    }))
    .toList(); // we need List not Seq

  if (test) {
    markersData = markersData
      .push(new immutable.Map({ // this marker i use to test positioning https://www.dropbox.com/s/oybq1nvogjfstlj/Screenshot%202015-05-06%2017.46.32.png?dl=0
        id: 'red selo',
        lat: 59.724465,
        lng: 30.080121,
        title: 'KRASNOYE SELO CIRCLE',
        description: 'circle',
        address: 'circle',
        image: imageRndUrl(),
        type: 0,
        number: '500$'
      }))
      .push(new immutable.Map({
        id: 'alaska',
        lat: 65.670915,
        lng: -153.093992,
        title: 'ALASKA',
        description: 'alaska',
        address: 'alaska',
        image: imageRndUrl(),
        type: 0,
        number: '501$'
      }));
  }

  return markersData;
}
