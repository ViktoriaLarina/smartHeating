# Stage 0,"build-stage", based on Node.js, to build and compile Angular
FROM node:8.11.0-alpine as builder

RUN set -x && mkdir -p /app
WORKDIR /app

COPY package.json ./package.json

RUN set -x && npm install

#build

COPY . .

ARG configuration=production

# RUN set -x && npm run build -- --output-path=./dist/out --configuration $configuration

RUN set -x && npm run build

# NGINX deployment

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
#FROM nginx:1.15

#COPY --from=builder /app/dist/ /usr/share/nginx/html/bioprom
#
#COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN set -x && \
   apk add --update --no-cache expect && \
   apk add coreutils && \
   apk add --update --no-cache gettext && \
   apk add --update --no-cache nginx

COPY --from=builder /app/dist/ /www/bioprom

WORKDIR /www/bioprom

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

RUN set -x && mkdir -p /ssl

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

COPY ./ssl/cert.crt /etc/nginx/conf.d/cert.crt

COPY ./ssl/cert.key /etc/nginx/conf.d/cert.key


#COPY ./config/nginx/mime.types /etc/nginx/conf/mime.types

#init_app_vars '/etc/nginx/conf.d/default.conf'
RUN echo "Starting nginx"
CMD ["nginx", "-g", "daemon off;"]
