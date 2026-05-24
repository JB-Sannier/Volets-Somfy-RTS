FROM postgres:18.4-alpine3.22
WORKDIR /docker-entrypoint-initdb.d
ADD init_scripts/docker_db_schemas_creation.sql /docker-entrypoint-initdb.d
VOLUME ./data:/var/lib/postgresql
EXPOSE 5432
