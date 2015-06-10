import { Actions } from 'flummox';

import routeTemplate from 'utils/route_template.js';
import utilsText from 'utils/text.js';

export default class RouteActions extends Actions {

  constructor(page) {
    super();
    this.page = page;
  }

  routeTemplatesCache_ = {};

  defaultRoute({routeName, routePath, routeContext, routeParams}) {
    return {routeName, routePath, routeContext, routeParams};
  }

  gotoLink(link) {
    this.page(link);
  }

  gotoLinkWParams(link, params, routeContextParams, defaultParams) {
    // const routeContextParams = routes_store.get_route_context_params ();

    if (routeContextParams && link !== undefined && typeof link === 'string') {
      if (!(link in this.routeTemplatesCache_)) {
        this.routeTemplatesCache_[link] = routeTemplate(link);
      }
      const linkTemplate = this.routeTemplatesCache_[link];
      const evaluatedLink = linkTemplate(
        utilsText.encode_link_object_properties(
           Object.assign(
            {},
            defaultParams || {},
            routeContextParams.toJS(),
            params || {}
            )
          )
        );

      this.page(evaluatedLink);
    } else {
      throw new Error('unrecognized link');
    }
  }
}
