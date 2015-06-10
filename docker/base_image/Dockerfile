FROM phusion/baseimage

# Use baseimage-docker's init system.
CMD ["/sbin/my_init"]

# ...put your own build instructions here...
#создать юзера с паролем password, и папку .ssh
RUN /usr/sbin/useradd --create-home --home-dir /home/ice --shell /bin/bash ice && \
echo "ice:password" | chpasswd && \
usermod -aG sudo ice && \
mkdir -p /home/ice/.ssh && \
chown ice /home/ice/.ssh && \
chmod 700 /home/ice/.ssh && \
echo 'ice ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

#настроить переменные окружения
ENV HOME /home/ice
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

#дадим доступ на чтение переменных окружения другим юзерам
RUN chmod 644 /etc/container_environment.sh

#добавим то что считаем нужным к ~/profile своего юзера см содержимое bash_profile
ADD bash_profile /home/ice/.bash_profile

#откопировать конфигурацию тмукса
ADD .tmux.conf /home/ice/.tmux.conf

RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash - && \
apt-get -y install nodejs

#запустить инсталл зависимостей
RUN apt-get -y install nfs-common

RUN apt-get -y install cmake git wget
RUN apt-get -y install build-essential tmux
RUN apt-get -y install g++ gcc
RUN apt-get -y install libboost-dev

#сменим права на локаллибы
RUN chown ice /usr/local/lib && \
chown ice /usr/local/include

# если мы не ставим пакет man-db, то можно убить все /usr/share/man/* тк их все равно нечем читать
# сейчас стираем только переводы манов
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/man/?? /usr/share/man/??_* /usr/share/man/??.*
