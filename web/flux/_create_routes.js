import sc from './consts/index.js';
import exampleDefs, {examples} from './consts/example_defs.js';

const routeNames = {
  K_DEFAULT_ROUTE: sc.K_SERVER_PATH + '/',
  K_MAP_ROUTE: sc.K_SERVER_PATH + '/map/:example/:zoom?',
  K_NO_ROUTE: '*'
};

export default function createRoutes({routeActions, mapActions, exampleActions}) {
  return {
    [routeNames.K_DEFAULT_ROUTE]: [
      routeActions.defaultRoute
    ],

    [routeNames.K_MAP_ROUTE]: [
      // ({routeParams}) => console.log('routeParams', routeParams), // test
      ({routeParams}) => mapActions.query({
        count: 1000, seed: 7, test: false, latVarM: 2, lngVarM: 4.5,
        typeGetter: routeParams.example === examples.balderdash ? i => i % 6 : i => i % 2,
        cacheBreaker: routeParams.example === examples.balderdash ? 6 : 2
      }),

      ({routeParams}) => {
        const K_BASE_EXAMPLE_INFO = {title: '', info: '', source: ''};
        const exampleInfo = Object.assign(K_BASE_EXAMPLE_INFO, exampleDefs[routeParams.example]);
        return exampleActions.initExampleInfo(exampleInfo);
      },

      routeActions.defaultRoute
    ]
  };
}

export {routeNames};
