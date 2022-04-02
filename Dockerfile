FROM node:lts

WORKDIR /auto-trade-api

# timezone
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3010

CMD [ "yarn", "start" ]