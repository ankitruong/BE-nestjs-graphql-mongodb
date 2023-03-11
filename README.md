## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Setup ENV
$ cp .env.demo .env
$ docker-compose up -d
$ npm run setup-rs $port
## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Running with docker
```bash
$ docker build -t xenia .
$ docker run --env-file=.env -p 3234:3000 xenia
```

## Watch API sandbox
```bash
$ set IS_DEVELOPMENT_MODE = true
$ go to https://studio.apollographql.com/sandbox/explorer
$ edit endpoint http://localhost:3000/xenia/graphql
$ check on documentation
```
## Introduction
```bash
- Technical description
-- NestJS - Clean Architecture
-- Mongoose
-- Apollo GraphQL
-- Google Oauth 2.0 
```
## Flow
```bash
Public domain: "http://khuongdao.me:30002"
Register: "http://khuongdao.me:30002/google"
Api: "http://khuongdao.me:30002/xenia/graphql"
Health: "http://khuongdao.me:30002/xenia/health"
Default username anki.truong98@gmail.com
Schema description src/graphql/schema.gql
Api collection: api-collection.postman_collection.json

- Data can be reset after longtime
- Everyone can see list cars
- Each username can only be registered once
- Each username only has 50 cars
- If createCars has the same vehicle model, user name, vehicle name -> No change
- If carDetails has the same carId, date -> update
- You can use default username
```

## Graphql example
```bash
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
          { date: "2023-03-09T03:51:14.037Z", price: 180000 }
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

mutation Mutation($username: String!) {
  removeByUsername(username: $username)
}
```
