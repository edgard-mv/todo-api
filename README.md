# REST API for list management app — SmartList

## First things first, create `.env` file with following variables
    PORT=4000
### Your database string connection, this is just an example
    DB_STRING=mongodb://localhost:27017/todo_api
### Salt rounds for password hashing, default is 10 if not provided
    SALT_ROUNDS=11 
### Secrets for JWT, be sure to use proper strings.
    TOKEN_SECRET=""
    REFRESH_SECRET=""
### Expiration time for your tokens, default is 5m
    EXP_TIME="15s"

## Install

    npm install

## Run the app

    npm start



# REST API

The REST API to the example app is described below.

## Create a new user

### Request

`POST /auth/signup`

### Body
```
{
    "name": "Edgard Morales",
    "username": "emorales",
    "email": "emorales@gmail.com",
    "password": "contraseña"
}
```

### Response
```
{
    "username": emorales
}
```
## Log user in

### Request

`POST /auth/login`

### Body
```
{
    "email": "emorales@gmail.com",
    "password": "contraseña"
}
```

### Response
This will return json with accessToken and refreshToken. 

## Get lists per user

### Request

`GET /users/:username/lists`

Your must to provide the accessToken in the Authorization header of the request.

### Response
This will return json containing all of the lists associated with the user.

## TODO: describe other routes...
