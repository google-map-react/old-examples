import React from 'react/addons';

import express from 'express';
import dot from 'dot';
import fs from 'fs';

import uuid from 'node-uuid';

import pick from 'lodash.pick';
import isString from 'lodash.isstring';

import * as userRoutesActions from '../web/flux/actions/user_routes.js';

const routeNames = pick(userRoutesActions, isString);

// import {routeNames} from '../web/flux/create_routes.js';

/*eslint-disable */
const configPath = __config + 'config.js';
const config = require(configPath);
/*eslint-enable */

let _render = null;

function getRender() {
  if (!config.K_USE_PRERENDER) {
    return null;
  }

  if (_render) return _render;

  if (__DEV__) {
    _render = require('../build/prerender/main.js');
  } else {
    try {
      _render = require('../build/prerender/main.js');
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
    }
  }
  return _render;
}

let K_SCRIPT_COMMONS_URL = null;
let K_SCRIPT_URL = null;
let K_SCRIPT_FAKER_URL = null;
let K_STYLE_URL = null;

function cacheMiddleware(seconds) {
  return (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=' + seconds);
    return next();
  };
}


function getContent(indexTpl, cfg, req, content, serializedData) {
  const fbTitle = 'facebook title';
  const twitterTitle = fbTitle;
  const description = 'some description';

  const image = (req.query.fb && req.query.fb.length > 2) ?
    'http://' + req.headers.host + cfg.K_SERVER_PATH + '/assets/images/logo_for_social.jpg' :
    'http://' + req.headers.host + cfg.K_SERVER_PATH + '/assets/images/logo_for_social.jpg';

  return indexTpl({
    config: {
      K_SERVER_PATH: cfg.K_SERVER_PATH,
      K_SCRIPT_URL: K_SCRIPT_URL,
      K_STYLE_URL: K_STYLE_URL,
      K_SCRIPT_COMMONS_URL: K_SCRIPT_COMMONS_URL,
      K_SCRIPT_FAKER_URL: K_SCRIPT_FAKER_URL,
      K_SESSION_UUID: uuid.v4(),
      K_PRERENDERED_CONTENT: content,
      K_SERIALIZED_DATA: serializedData
    },

    FB: {
      image: image, // 'http://' + req.headers.host +  '/assets/images/private-beach.jpg',
      title: fbTitle,
      description: description
    },

    twitter: {
      image: image, // 'http://' + req.headers.host +  '/assets/images/private-beach.jpg',
      title: twitterTitle,
      description: description
    }
  });
}


const router = new express.Router();


let indexHtmlContent = null;
let indexTemplate = null;

console.log('Routes: ', Object.keys(routeNames) // eslint-disable-line no-console
  .map(routeName => routeNames[routeName])
  .filter(route => route !== '*'));

Object.keys(routeNames)
.map(routeName => routeNames[routeName])
.filter(route => route !== '*')
.forEach((route) => {
  router.route(route)
  .all(cacheMiddleware(config.K_CACHE_MAIN_PAGE_SECONDS))
  .get((req, res) => {
    console.log('-------EE---', req.path);
    try {
      if (!config.K_IS_PRODUCTION || K_SCRIPT_URL === null) {
        const stats = require('../build/stats.json');
        const publicPath = stats.publicPath;
        const urls = [].concat(stats.assetsByChunkName.main);

        K_STYLE_URL = urls.length > 1 ? publicPath + urls[1] : null;
        K_SCRIPT_URL = publicPath + urls[0];
        K_SCRIPT_COMMONS_URL = stats.assetsByChunkName.commons ? publicPath + stats.assetsByChunkName.commons : null;
        K_SCRIPT_FAKER_URL = stats.assetsByChunkName.faker ? publicPath + stats.assetsByChunkName.faker : null;

        indexHtmlContent = fs.readFileSync(config.K_DEV_RELEASE + '/public/index.html', 'utf8');
        indexTemplate = dot.template(indexHtmlContent);
      }

      const render = getRender();
      if (render) {
        render({
          startPath: req.path,
          dispatch: false,
          serialize: true
        },
        (err, {component, serializedData}) => {
          if (err) {
            console.error(err); // eslint-disable-line no-console
            res.status(500).send(err.toString());
            return;
          }

          const html = React.renderToString(component);
          const content = getContent(indexTemplate, config, req, html, JSON.stringify(serializedData));
          res.send(content);
        });
      } else {
        const content = getContent(indexTemplate, config, req, '', 'null');
        res.send(content);
      }
    } catch (e) {
      if (__DEV__) {
        console.error(e, e.stack); // eslint-disable-line no-console
      }

      res.status(500).send('please wait, please wait build to complete, ' + e.toString());
    }
  });
});

module.exports = router;
