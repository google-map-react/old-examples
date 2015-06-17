import express from 'express';
import cacheMiddleware from './utils/cache_middleware.js';

import dot from 'dot';
import fs from 'fs';

import pick from 'lodash.pick';
import isString from 'lodash.isstring';
import * as userRoutesActions from '../web/flux/actions/user_routes.js';

import getIsomorphicRender from './utils/get_isomorphic_render.js';
import fillTemplateWithContent from './utils/fill_template_with_content.js';

/*eslint-disable */
const configPath = __config + 'config.js';
const config_ = require(configPath);
/*eslint-enable */

const routeNames_ = pick(userRoutesActions, isString);

let webpackStatJsonData_ = null;
let indexTemplate_ = null;

const router = new express.Router();

// TODO: rewrite this all
console.log('Routes: ', Object.keys(routeNames_) // eslint-disable-line no-console
  .map(routeName => routeNames_[routeName])
  .filter(route => route !== '*'));

Object.keys(routeNames_)
  .map(routeName => routeNames_[routeName])
  .filter(route => route !== '*')
  .forEach((route) => {
    router.route(route)
      .all(cacheMiddleware(config_.K_CACHE_MAIN_PAGE_SECONDS))
      .get((req, res) => {
        try {
          if (!config_.K_IS_PRODUCTION || webpackStatJsonData_ === null) {
            const stats = require('../build/stats.json');
            const publicPath = stats.publicPath;
            const urls = [].concat(stats.assetsByChunkName.main);

            webpackStatJsonData_ = {
              K_STYLE_URL: urls.length > 1 ? publicPath + urls[1] : null,
              K_SCRIPT_URL: publicPath + urls[0],
              K_SCRIPT_COMMONS_URL: stats.assetsByChunkName.commons ? publicPath + stats.assetsByChunkName.commons : null,
              K_SCRIPT_FAKER_URL: stats.assetsByChunkName.faker ? publicPath + stats.assetsByChunkName.faker : null
            };

            let indexHtmlContent = fs.readFileSync(config_.K_DEV_RELEASE + '/public/index.html', 'utf8');
            indexTemplate_ = dot.template(indexHtmlContent);
          }

          const isomorphicRender = getIsomorphicRender(config_.K_USE_PRERENDER);

          if (isomorphicRender) {
            isomorphicRender({isClient: typeof window !== 'undefined', serverPath: req.path})
              .then(
                ({html, initialState}) => {
                  const content = fillTemplateWithContent(indexTemplate_, webpackStatJsonData_, config_, req, html, JSON.stringify(initialState));
                  res.send(content);
                },
                (err) => {
                  console.error(err); // eslint-disable-line no-console
                  res.status(500).send(err.toString());
                  return;
                }
              );
          } else {
            const content = fillTemplateWithContent(indexTemplate_, webpackStatJsonData_, config_, req, '', 'null');
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
