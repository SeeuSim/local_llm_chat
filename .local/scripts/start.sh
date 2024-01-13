EXIST_VOLUME=$(docker volume ls | grep llmchat-db-docker)

if [ -z "$EXIST_VOLUME" ]; then
  docker volume create llmchat-db-docker
fi

docker compose up -d
