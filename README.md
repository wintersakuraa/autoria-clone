# AutoRia Clone

## Local Setup

```bash
# install packages
$ yarn 

# add env variables
$ mv .env.example .env

# run docker containers with postgres db and redis
$ docker compose up --build -d
```

## Apply migrations

```bash
$ yarn migration:run
```

> **Note**: First Admin user is created when migrations are run.
>
> Specify credentials in `.env` file.
>
> **⚠️ Warning:**
> The `ADMIN_PASSWORD` variable must have argon2 hash format.
 
> Default Admin credentials
>```
>email: admin@gmail.com
>password: Password3
>```

## Running the app

```bash
# build
$ yarn build

# development
$ yarn start

# watch mode
$ yarn start:dev

# production
$ yarn start:prod
```
