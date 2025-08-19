require("dotenv").config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const { getProtocol } = require("../utils/ipUtils");
const { NODE_ENV, NET_INTERFACE, APP_PORT} = process.env;

const config = {};

const protocol = getProtocol();
const buildURL = (ip, port, protocol) => `${protocol}://${ip}:${port}/`;

config.domain = NET_INTERFACE || "localhost";

if (NODE_ENV === "production") {
    config.HOST_URL = `${protocol}://${config.domain}/`;
} else {
    config.HOST_URL = buildURL(NET_INTERFACE || "localhost", APP_PORT || 3000, protocol);
}

// Default MySQL config
config.mysql = {
    host: "localhost",
    port: 3306
};

// Default Redis config
config.redis = {
    host: "127.0.0.1",
    port: 6379
};

module.exports = config;