"use strict";
const crypto = require("crypto");
const { encryption } = require("../config/config.third.party");

const safeStringify = (obj, replacer = null) => {
  let cache = [];
  const json = JSON.stringify(
    obj,
    (key, value) =>
      typeof value === "object" && value !== null
        ? cache.includes(value)
          ? undefined // Prevent circular reference
          : cache.push(value) && value
        : value,
    0 // Compress JSON by setting it zero
  );
  cache = null; // Enable garbage collection
  return json;
};


function encryptRSA(plainText) {
  try {
    const buffer = Buffer.from(plainText, "utf8");
    const encrypted = crypto.publicEncrypt(
      {
        key: encryption.riaPublicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      buffer
    );
    return encrypted.toString("base64");
  } catch (err) {
    throw new Error("RSA Encryption failed: " + err.message);
  }
}

function decryptRSA(base64Text) {
  try {
    const buffer = Buffer.from(base64Text, "base64");
    const decrypted = crypto.publicDecrypt(
      {
        key: encryption.riaPublicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      buffer
    );
    return decrypted.toString("utf8");
  } catch (err) {
    throw new Error("RSA Decryption failed: " + err.message);
  }
}

function base64Encode(data) {
  return Buffer.from(data, "utf8").toString("base64");
}

function base64Decode(data) {
  return Buffer.from(data, "base64").toString("utf8");
}

module.exports = {
  safeStringify,
  encryptRSA,
  decryptRSA,
  base64Encode,
  base64Decode
};
