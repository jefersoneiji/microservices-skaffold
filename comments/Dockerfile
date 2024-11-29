FROM denoland/deno:1.46.1

EXPOSE 8081 

WORKDIR /app

USER deno

COPY . . 
RUN deno cache src/routes.ts
CMD ["task","dev"]
