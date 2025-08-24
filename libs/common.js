"use strict";
const crypto = require("crypto");

function encryptRSA(data, publicKey) {
  try {
    const buffer = Buffer.from(data, "utf8");
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );
    return encrypted.toString("base64");
  } catch (error) {
    throw new Error(`RSA encryption failed: ${error.message}`);
  }
}

function decryptRSA(encryptedData, privateKey) {
  try {
    const buffer = Buffer.from(encryptedData, "base64");
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    );
    return decrypted.toString("utf8");
  } catch (error) {
    throw new Error(`RSA decryption failed: ${error.message}`);
  }
}

function base64Encode(decodedData) {
  return Buffer.from(decodedData, 'utf8').toString('base64');
}

function base64Decode(encodedData) {
  return Buffer.from(encodedData, "base64").toString("utf8");
}

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

module.exports = {
  safeStringify,
  encryptRSA,
  decryptRSA,
  base64Encode,
  base64Decode,
};
