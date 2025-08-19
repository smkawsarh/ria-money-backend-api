"use strict";
const service = require("./service");
const logger = require("../../../libs/logger");
const {safeStringify} = require("../../../libs/common");
module.exports = {
  handleRrequest: async (req, res) => {
    const request = Object.assign({}, req.body || req);
    const payload = {
       function:request.function,
       mobile: request.mobile 
      };

    try {
      const result = await service.fetchWalletDetails(payload);
      logger.info(`Final response: ${safeStringify(result)}`);

      res.json({
        is_success: result.is_success,
        code: result.code,
        response_message: result.response_message,
        response_data: result.response_data,
      });
    } catch (error) {
      res.status(500).json({
        is_success: false,
        code: "500",
        response_message: error.message || "Internal Server Error",
        response_data: null,
      });
    }
  },
};
