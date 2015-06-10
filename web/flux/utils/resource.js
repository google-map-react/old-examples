const routeTemplate = require('utils/route_template.js');
const textUtils = require('utils/text.js');


function http(method, url, object, options) {
  let fetchOptions;

  const baseOptions = {
    method: method,
    credentials: 'include'
  };

  if (object === null) {
    fetchOptions = Object.assign({}, baseOptions, options);
  } else {
    if (object) {
      // if (object && object.constructor && object.constructor.toString().indexOf('FormData') > -1) {
      if (object instanceof FormData) {
        fetchOptions = Object.assign({body: object}, baseOptions, options);
      } else {
        fetchOptions = Object.assign({
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(object)
          }, baseOptions, options);
      }
    }
  }

  return fetch(url, fetchOptions)
    .then(response => response.json());
}


export default function(route, options) {
  const routeTpl = routeTemplate(route);

  return {
    get(obj) {
      return http('get', routeTpl(textUtils.encode_object_properties(obj)), null, options);
    },

    post(obj) {
      return http('post', routeTpl(textUtils.encode_object_properties(obj)), obj, options);
    },

    save(context, obj) {
      return http('post', routeTpl(textUtils.encode_object_properties(context)), obj, options);
    }
  };
}
