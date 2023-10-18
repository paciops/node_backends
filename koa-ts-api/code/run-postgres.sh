#!/bin/bash
container=postgres
user=test
password=test
database=test

docker run --name postgres --rm -e POSTGRES_USER=$user -e POSTGRES_PASSWORD=$password --network host -d $container

sleep 5

cat ./sql/create_tables.sql | docker exec -i $container psql -U $user -d $database