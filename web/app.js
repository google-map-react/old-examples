// client only module
import './polyfills.js';
require('fs-loader?name=../../build/public/[name].[ext]!./templates/index.html');
require('./assets/fonts/flaticon.css');
require('components/controls/fixed_table/fixed-data-table-ice/dist/fixed-data-table.css');
require('./sass/app.sass');

import isomorphicRender from './isomorphic_render.js';
isomorphicRender({isClient: typeof window !== 'undefined'});
