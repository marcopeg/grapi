
###
### DEVELOPMENT
###

dev:
	HUMBLE_ENV=dev humble up -d
	HUMBLE_ENV=dev humble logs -f

undev:
	HUMBLE_ENV=dev humble down

dev-ssh:
	HUMBLE_ENV=dev humble exec webapp /bin/sh

dev-build:
	HUMBLE_ENV=dev humble exec webapp yarn build

dev-locale:
	HUMBLE_ENV=dev humble exec webapp yarn build:locale

dev-pg:
	HUMBLE_ENV=dev humble up -d postgres
	HUMBLE_ENV=dev humble logs -f

dev-db:
	HUMBLE_ENV=dev humble up postgres -d
	HUMBLE_ENV=dev humble logs -f postgres


###
### PRODUCTION
###

prod:
	HUMBLE_ENV=prod humble up -d --build
	HUMBLE_ENV=prod humble logs -f
	
unprod:
	HUMBLE_ENV=prod humble down

prod-db:
	HUMBLE_ENV=prod humble up postgres -d
	HUMBLE_ENV=prod humble logs -f postgres


###
### Heroku
###

heroku-deploy:
	git subtree push --prefix services/webapp heroku master
	heroku logs --tail --app learnmap2

heroku-logs:
	heroku logs --tail --app learnmap2
