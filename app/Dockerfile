# Dockerfile to deploy yoga server to tmcc vm dokku setup
# deploy via git push to dokku remote - dokku@s-tmcc-cbasp.charite.de:cba-prisma-yoga
FROM node:12.16.1

# Create app directory
WORKDIR /usr/buddybackend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# COPY . /server

# set node env to production:
# set the argument default
ARG NODE_ENV=production
# assign it to an environment variable
# we can wrap the variable in brackets
ENV NODE_ENV ${NODE_ENV}
# use the argument
RUN echo $NODE_ENV

# setup npm proxies to make install possible
RUN git config --global http.proxy http://proxy.charite.de:8080/ && \
    npm config set strict-ssl=false \
    npm config set proxy=http://proxy.charite.de:8080/ && \
    npm config set https-proxy=http://proxy.charite.de:8080/

RUN npm set unsafe-perm true

#install global packages - typescript compiler
RUN npm install -g typescript

# If you are building your code for production
#RUN npm install --only=production
RUN npm install
# Bundle app source
COPY . .

# environment vars need to be set with 'dokku config:set'
# ENV PRISMA_ENDPOINT  https://s-tmcc-buddy-prisma.charite.de:4466

EXPOSE 4000

RUN tsc
# ENTRYPOINT ["node", "dist/"]
# CMD [ "npm", "start" ]
CMD [ "node", "./dist/index.js" ]
