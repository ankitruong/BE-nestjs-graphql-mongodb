## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setup ENV
$ copy .env.demo -> .env
$ docker-compose up  
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Watch API sandbox
```bash
$ set IS_DEVELOPMENT_MODE = true
$ go to https://studio.apollographql.com/sandbox/explorer
$ edit endpoint http://localhost:3000/xenia/graphql
$ check on documentation
```

## OAuth 2.0
```bash
$ Google OAuth
$ go to DOMAIN_URI/google
$ ex: http://localhost:3000/google
```
## Introduction
```bash
- Technical description
-- NestJS - Clean Architecture
-- Mongoose
-- Apollo GraphQL
```
## Graphql example
```bash
default username anki.truong98@gmail.com
schema description src/graphql/schema.gql
query GetUserDefault {
  getUserDefault {
    username
    uuid
  }
}

mutation CreateCars {
  createCars(
    cars: [
      {
        carName: "vios"
        model: TOY
        carDetails: [{ date: "2023-03-09T03:51:14.037Z", price: 200000 }]
      }
    ]
    username: "anki.truong98@gmail.com"
  ) {
    carName
    carDetails {
      carInfo {
        uuid
      }
      date
      price
      uuid
    }
    model
    username
    uuid
  }

query GetAll {
  getAll(
    query: { owners: ["anki.truong98@gmail.com"] }
  ) {
    carInfo {
      model
      createAt
      updateAt
      username
      uuid
      carName
    }
    price
    date
    uuid
    createdBy
  }
}

mutation ActiveCars {
  activeCars(
    cars: [
      {
        carId: $carId from getAll
        carDetails: [
          { date: "2023-03-10T03:51:14.037Z", price: 200000 }
          { date: "2023-03-9T03:51:14.037Z", price: 180000 }
        ]
      }
    ]
    username: "anki.truong98@gmail.com"
  ) {
    uuid
    username
    carName
    createAt
    model
    carDetails {
      date
      price
    }
  }
}
}

mutation Mutation($username: String!) {
  removeByUsername(username: $username)
}
```