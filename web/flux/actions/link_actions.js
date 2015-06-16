import routeTemplate from 'utils/route_template.js';
import utilsText from 'utils/text.js';
import {SWITCH_LINK} from 'consts/link_action_types.js';

const routeTemplatesCache_ = {};


export function gotoLink(url) {
  return {
    type: SWITCH_LINK,
    url
  };
}

export function gotoLinkWParams(link, params, routeContextParams, defaultParams) {
  if (routeContextParams && link !== undefined && typeof link === 'string') {
    if (!(link in routeTemplatesCache_)) {
      routeTemplatesCache_[link] = routeTemplate(link);
    }

    const linkTemplate = routeTemplatesCache_[link];
    const url = linkTemplate(
      utilsText.encode_link_object_properties(
        Object.assign(
          {},
          defaultParams || {},
          routeContextParams.toJS(),
          params || {}
        )));

    return {
      type: SWITCH_LINK,
      url
    };
  }

  throw new Error('unrecognized link');
}
