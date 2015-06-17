##Routing approach

###IMHO:
Where is no need in 90% of web apps to use reach api routing libraries.

###SOLUTION IN SHORT:
Bind `onRouteChangeCallback` on `flux action`.

###SOLUTION WITH EXAMPLES:
For client-server solution router must expose two functions with (*plus-minus*) next interfaces
  1. `gotoRoute(url)` for client side
  2. `router(routePathes, initialRouteDispatch, onRouteChangeCallback)` for server and client side   
      where 
      * `routePathes` is a `map: string => string` and can be defined [somewhere](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/actions/user_routes.js#L18-L20)
      
      ```javascript
      export const K_DEFAULT_ROUTE = '/';
      export const K_MAP_ROUTE = '/map/:example/:zoom?';
      export const K_NO_ROUTE = '*';
      ```
      
      * `initialRouteDispath: boolean` - if true `router` route to current path at initialization (*useful for client but not required in order of `gotoRoute`*).
      
      * `onRouteChangeCallback` - router onRouteChange  callback with any parameters it can expose, for me this parameters are 
      
      ```javascript
      callback({routeName, routePath, routeParams, routeFullPath}) { ...
      // this gives for real route '/map/hello/world' next parameters
      // routeName = 'K_MAP_ROUTE'
      // routePath = '/map/:example/:zoom?'
      // routeParams = {example: 'hello', zoom: 'world'}
      // routeFullPath = '/map/hello/world'
      ```
  


Then you can [bind router callback to flux action](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/init_redux.js#L40), 
and create [simple flux store](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/stores/router_store.js) for router data  
  
Next steps are simple, as [like flux work](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/render.js#L16) 
just subscribe on `router store` changes, 
and use [simple switch-case](https://github.com/istarkov/google-map-react-examples/blob/master/web/flux/components/main.jsx#L78) or create your simple `<Router handler={}` approach. 


      
      
