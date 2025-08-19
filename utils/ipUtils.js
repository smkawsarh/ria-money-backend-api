function getProtocol(app) {
  if (app && app.get && app.get("https")) {
    return "https";
  }
  return process.env.HTTPS === "true" ? "https" : "http";
}

// Optional: get port from environment
function getPort() {
  const port = parseInt(process.env.APP_PORT, 10) || 3000;
  if (isNaN(port)) {
    throw new Error("Invalid port number");
  }
  return port;
}

module.exports = { getProtocol, getPort };