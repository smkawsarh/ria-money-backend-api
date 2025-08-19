"use strict";

const config = require("./config.default");

// MySQL
config.mysql.host = "127.0.0.1";
config.mysql.port = 3306;
config.mysql.username = "";
config.mysql.password = "";
config.mysql.database = "";

// Redis
config.redis.host = "127.0.0.1";
config.redis.port = 6379;
config.redis.username = "";
config.redis.password = "";
config.redis.db = 0;

// Tokens

module.exports = config;
