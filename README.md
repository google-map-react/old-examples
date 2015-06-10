#google-map-react examples
This project is isomorphic flummox app with google-map-react control examples.
It uses modified [page.js](https://visionmedia.github.io/page.js/) for routing.


---


##Install
I highly recommend to use docker for development.

###For non docker users
* Install   
  ```bash
  npm install  
  ```

* Run developer build with hot reload  
  ```bash
  #console 1
  npm run hot-dev-server
  ```

  ```bash
  #console 2
  npm run start
  ```
  *run browser and type* [http://localhost:3000/map/main](http://localhost:3000/map/main)

* Run production build (*isomorphic*)   
  ```bash
  #console 1
  NODE_ENV=production npm run build
  NODE_ENV=production npm run start
  ```
  *run browser and type* [http://localhost:3000/map/main](http://localhost:3000/map/main)

* Environment variables you can set   
  ```
  NODE_ENV default undefined (for production version must be set NODE_ENV='production')
  EXT_IP default 0.0.0.0 (if you need hot reload work on your subnetwork set as your local network ip)
  HOT_RELOAD_PORT default 3081 (any port for hotreload to work)
  SERVER_PATH default empty string ''
  USE_PRERENDER default equal to true if NODE_ENV === 'production'
  ```


---


###For docker users:
* Install   
  ```bash
  ./docker/base_image/build.sh
  ./docker/react_image/build.sh
  #and add bash_profile aliases from ./docker/bash_profile
  cat ./docker/bash_profile >> ~/.bash_profile
  source ~/.bash_profile
  ```

* Run developer build with hot reload   
  ```bash
  ./docker_run
  ```
  *run browser and type* [http://localhost:3000/map/main](http://localhost:3000/map/main)

* Run production build (*isomorphic*)   
  ```bash
  ./docker_run --production
  ```
  *run browser and type* [http://localhost:3000/map/main](http://localhost:3000/map/main)

* Enter container to view or to test anything (*be sure bash_profile aliases from ./docker/bash_profile installed*)   
  ```bash
  #be sure bash_profile aliases from ./docker/bash_profile installed
  denter gmr
  tmux att
  ```


---


#For Docker OSX users:
* install watchman   
  ```bash
  brew install watchman
  ```

* fix watchman add this to ~/Library/LaunchAgents/com.github.facebook.watchman.plist   
  ```xml
  <key>EnvironmentVariables</key>
  <dict>
      <key>PATH</key>
      <string>/Users/ice/v-1/install/google-sdk/google-cloud-sdk/bin:/usr/local/opt/coreutils/libexec/gnubin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/CrossPack-AVR/bin:/usr/local/go/bin:/Users/ice/v-1/checker-276:/home/ice/web_projects/amazon_ec2/ec2-api-tools-1.6.13.0/bin</string>
  </dict>
  ```

  ```bash
  launchctl unload -w ~/Library/LaunchAgents/com.github.facebook.watchman.plist
  launchctl load -w ~/Library/LaunchAgents/com.github.facebook.watchman.plist
  ```

* install boot2docker with nfs support (vboxfs is really-really slow) 
