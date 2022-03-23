FROM node:lts

WORKDIR /auto-trade-api

# timezone
ENV TZ=Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV PORT=3001
ENV UPBIT_ACCESS_KEY=UDgx294CT64wyrhkKJ4dbk8oKnCLaze5qtrM5e0M
ENV UPBIT_SECRET_KEY=YHbgxjlTzF4KYpwG3Kjhi1M91YpZNSep6aPFWgHO
ENV MONGODB_URI=s6n.tpecz.mongodb.net
ENV MONGODB_USERNAME=byun618
ENV MONGODB_PASSWORD=1473026130a!

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3001

CMD [ "yarn", "start" ]