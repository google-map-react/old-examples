import './polyfills.js';

require('fs-loader?name=../../build/public/[name].[ext]!./templates/index.html');

require('./assets/fonts/flaticon.css');
require('components/controls/fixed_table/fixed-data-table-ice/dist/fixed-data-table.css');
require('./sass/app.sass');

import React from 'react/addons';
import render from './flux/render.js';


if (typeof window !== 'undefined') {
  if (__DEV__) {
    window.React = React; // for devtools
  }
  React.initializeTouchEvents(true); // для тач ивентов
}

const initialState = (typeof window !== 'undefined') ? (window.K_SERIALIZED_DATA || undefined) : undefined;

// const serverPath = undefined;
render({React, initialState /*, serverPath*/})
.then(
  ({component}) => React.render(component, document.getElementById('react_main')),
  (err) => {
    console.error('error', err);
    console.info('Please add route *');
    throw err;
  }
);
