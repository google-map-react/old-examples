FROM google_map_react/baseimage

RUN apt-get update && \
npm install -g node-gyp && \
chown ice -R /home/ice/.npm


# Install Nginx for default config.
RUN echo "deb http://ppa.launchpad.net/nginx/stable/ubuntu trusty main" > /etc/apt/sources.list.d/nginx-stable-trusty.list && \
echo "deb-src http://ppa.launchpad.net/nginx/stable/ubuntu trusty main" >> /etc/apt/sources.list.d/nginx-stable-trusty.list  && \
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C300EE8C  && \
apt-get update  && \
apt-get install --only-upgrade bash  && \
apt-get install -y  wget nginx

RUN echo "daemon off;" >> /etc/nginx/nginx.conf && \
sed -i 's/error_log.*;/error_log \/dev\/stdout info;/g' /etc/nginx/nginx.conf && \
sed -i 's/access_log.*;/access_log \/dev\/stdout;/g' /etc/nginx/nginx.conf

#fix for long server names
RUN sed -i 's/# server_names_hash_bucket/server_names_hash_bucket/g' /etc/nginx/nginx.conf


#Install openresty
RUN apt-get install -y libreadline-dev libncurses5-dev libpcre3-dev libssl-dev perl make && \
cd /tmp && \
wget http://openresty.org/download/ngx_openresty-1.7.10.1.tar.gz && \
tar xzvf ngx_openresty-1.7.10.1.tar.gz && \
cd ngx_openresty-1.7.10.1 && \
./configure && \
make && \
make install && \
mkdir -p /home/ice/nginxlog/logs

#install imagemagick
RUN apt-get install -y imagemagick && \
add-apt-repository -y ppa:groonga/ppa && \
apt-get update  && \
apt-get install -y libgroonga-dev groonga && \
apt-get -y install groonga-normalizer-mysql


#register runit
ADD runit/nginx /tmp/nginx_run
RUN mkdir /etc/service/nginx && \
cp /tmp/nginx_run /etc/service/nginx/run

RUN ldconfig

# Clean APT if need.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

USER ice
#nginx logs
RUN mkdir -p /home/ice/nginxlog/logs
USER root


# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]
