mkdir -p ./output/
# 避免污染外部环境在docker内操作打包部署

cp -r ./logconfig ./output/logconfig
cp -r ./public ./output/public
cp -r ./nodeInstall ./output/nodeInstall
cp -r ./src ./output/src
cp  ./index.html ./output
cp  ./postcss.config.cjs ./output
cp  ./process.json ./output
cp  ./package.json  ./output
cp  ./proxy.ts  ./output
cp  ./tsconfig.json  ./output
cp  ./tsconfig.node.json ./output
cp  ./vite.config.ts  ./output
cp  ./server-prod.js ./output


# 设置 dockerfile 文件
echo "FROM node:20.12.2-alpine3.19" > ./Dockerfile
echo "WORKDIR /app" >> ./Dockerfile
echo "COPY ./output /app" >> ./Dockerfile
echo "RUN yarn config set registry https://registry.npmmirror.com/" >> ./Dockerfile
echo "RUN yarn config get registry" >> ./Dockerfile
echo "RUN yarn install " >> ./Dockerfile
echo "RUN yarn build " >> ./Dockerfile
echo "RUN yarn global add pm2" >> ./Dockerfile
echo "RUN rm -r src && rm -r public && rm -r node_modules" >> ./Dockerfile
echo "RUN rm index.html && rm postcss.config.cjs && rm proxy.ts && rm tsconfig.json && rm tsconfig.node.json && rm vite.config.ts" >> ./Dockerfile
echo "COPY ./output/nodeInstall /app" >> ./Dockerfile
echo "RUN rm yarn.lock " >> ./Dockerfile
echo "RUN yarn install " >> ./Dockerfile
echo "RUN rm yarn.lock " >> ./Dockerfile
echo "EXPOSE 8000" >> ./Dockerfile
echo "CMD pm2-runtime start process.json" >> ./Dockerfile



