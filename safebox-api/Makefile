.PHONY: test coverage

deps:
	docker-compose run --rm node yarn install

down:
	docker-compose down

up: deps
	docker-compose up -d api

test: deps
	docker-compose run --rm -e CI=true -e SKELETON_ENV=test node yarn test

coverage: deps
	docker-compose run --rm -e CI=true -e SKELETON_ENV=test node yarn test --coverage
