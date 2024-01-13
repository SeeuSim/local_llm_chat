setup:
	npm install \
	&& npm run prepare

up: 
	./.local/scripts/start.sh \
	&& sleep 1 \
	&& npm run migrate

down: 
	docker compose down

clean:
	./.local/scripts/clean.sh
