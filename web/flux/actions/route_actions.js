import routeTemplate from 'utils/route_template.js';
import utilsText from 'utils/text.js';

export default function createRouteActions(page) {
  const routeTemplatesCache_ = {};

  return {
    defaultRoute({routeName, routePath, routeContext, routeParams}) {
      return {routeName, routePath, routeContext, routeParams};
    },

    gotoLink(link) {
      page(link);
    },

    gotoLinkWParams(link, params, routeContextParams, defaultParams) {
      // const routeContextParams = routes_store.get_route_context_params ();

      if (routeContextParams && link !== undefined && typeof link === 'string') {
        if (!(link in routeTemplatesCache_)) {
          routeTemplatesCache_[link] = routeTemplate(link);
        }
        const linkTemplate = routeTemplatesCache_[link];
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

        page(evaluatedLink);
      } else {
        throw new Error('unrecognized link');
      }
    }
  };
}
