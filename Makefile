up: 
	./.local/scripts/start.sh \
	&& sleep 1 \
	&& npm run migrate \
	&& npm run build:dev \
	&& npm run start:dev

down: 
	docker compose down

clean:
	./.local/scripts/clean.sh
