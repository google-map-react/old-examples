import './polyfills.js';

require('fs-loader?name=../../build/public/[name].[ext]!./templates/index.html');

require('./assets/fonts/flaticon.css');
require('components/controls/fixed_table/fixed-data-table-ice/dist/fixed-data-table.css');
require('./sass/app.sass');

// require('./app.js');
import React from 'react/addons';
import render from './flux/app.js';

if (typeof window !== 'undefined') {
  if (__DEV__) {
    window.React = React; // for devtools
  }
  React.initializeTouchEvents(true); // для тач ивентов
}

const serializedData = (typeof window !== 'undefined') ? (window.K_SERIALIZED_DATA || null) : null;
const dispatch = serializedData === null ? true : false; // нет смысла если данные уже есть
// console.log('serializedData', JSON.parse(serializedData));

render({dispatch, serializedData}, (err, {component}) => {
  if (err) {
    console.error('error', err);
    console.info('Please add route * to create_routes.js');
    return;
  }

  React.render(component,
    document.getElementById('react_main')
  );
});

