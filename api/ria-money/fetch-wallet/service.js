"use strict";
const axios = require("axios");
const https = require("https");
const {
  base64Encode,
  base64Decode,
  encryptRSA,
  decryptRSA,
  safeStringify,
} = require("../../../libs/common");
const logger = require("../../../libs/logger");
const {
  stagingUrl,
  partitionId,
  channelId,
  channelPassword,
  encryption,
} = require("../../../config/config.third.party");
const httpCodes = require("../../../libs/http-codes");

module.exports = {
  async fetchWalletDetails(input) {
    const now = new Date();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
      
    const requestRefNo =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      randomNum;

    const requestTimeStamp =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0") +
      String(now.getMilliseconds()).padStart(3, "0");

    console.log(requestTimeStamp);

    const requestData = {
      function: input.function,
      mobile: input.mobile,
    };

    const requestPayload = {
      partitionId,
      channelId,
      channelPassword,
      requestRefNo,
      requestTimeStamp,
      requestType: "FETCHCRDDT",
      requestData: base64Encode(JSON.stringify(requestData)),
    };
    logger.info(`Request-Payload: ${safeStringify(requestPayload)}`);

    try {
      // const httpsAgent = encryption.clientCertificate
      //   ? new https.Agent({
      //       cert: encryption.clientCertificate,
      //       rejectUnauthorized: true,
      //       keepAlive: true,
      //     })
      //   : undefined;
      // const response = await axios.post(stagingUrl, requestPayload, {
      //   timeout: 30000,
      //   ...(httpsAgent && { httpsAgent }),
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      // });
      const response = await axios.post(stagingUrl, requestPayload, {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const resp = response.data;
      logger.info(`Fetch wallet api Response Data: ${safeStringify(resp)}`);

      if (resp.responseCode === "000") {
        const decoded = JSON.parse(base64Decode(resp.responseData));

        if (decoded.firstName)
          decoded.firstName = decryptRSA(decoded.firstName);
        if (decoded.middleName)
          decoded.middleName = decryptRSA(decoded.middleName);
        if (decoded.lastName) decoded.lastName = decryptRSA(decoded.lastName);

        return {
          is_success: true,
          code: httpCodes.OK.code,
          response_message: resp.responseMsg,
          response_data: decoded,
        };
      } else {
        return {
          is_success: false,
          code: httpCodes.EXPECTATION_FAILED.code,
          response_message: resp.responseMsg,
          response_data: resp,
        };
      }
    } catch (error) {
      logger.error(
        `RIA API Error: ${safeStringify(error.response?.data || error.message)}`
      );

      return {
        is_success: false,
        code: "500",
        response_message: "RIA Fetch Wallet API error",
        response_data: {
          error: error.message,
          details: error.response?.data || null,
        },
      };
    }
  },
};
