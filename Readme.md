# Account Management Backend

* Before get started create `.env` file by `.env.example`
* Run `npm install`.
* Run the tests with `npm run test`.

# What has been done 

* Designed project structure
* Added Script router to create update delete `Account` and `Transaction` tables
* Added sequelize module to work with mysql, sqlite
* Created Migrations for `Account` and `Transaction` tables
* Data creating made with transactions to avoid conflicts when making requests at the same time to same table

# Result

* Test passes normal.
* Postman calls working.

# Todos

* make code more modular
* write missing codes for some endpoints.