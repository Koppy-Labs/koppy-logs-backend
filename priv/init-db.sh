#!/bin/bash
set -e

# Run the standard entrypoint setup from Postgres
export PGPASSWORD="$POSTGRES_PASSWORD"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE koppy_logs;
    CREATE DATABASE koppy_logs_test;
EOSQL