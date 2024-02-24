# [Nest](https://github.com/nestjs/nest) Backend Template

by [Degitic House](https://degitichouse.com)

## Description

Backend Server for Gym Management System

## Installation

```bash
yarn
```

## Running the app

### Local Runtime

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod
```

Available at `localhost:3000`

### Docker

```bash
# docker build
docker build -t <image>:<tag> .

# docker run
docker run --name "<container-name>" -p <port>:3000 <image>:<tag>
```

## Test

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# test coverage
yarn test:cov
```

## Testing

Test folder includes a `api.rest` file for REST Client Testing.

## Prerequesites

### Environment Variables

Refer to the `.env.example` file for environment file structure.
