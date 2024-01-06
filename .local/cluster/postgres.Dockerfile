FROM ankane/pgvector

LABEL author="Ong Seeu Sim"
LABEL description="Postgres Image for an isolated LLM cluster"
LABEL version="1.0"

COPY *.sql /docker-entrypoint-initdb.d/