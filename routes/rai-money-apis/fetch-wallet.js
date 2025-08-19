const express = require('express');
const router = express.Router();

const {
  handleRrequest,
} = require('../../api/ria-money/fetch-wallet/controller.js');

router.post(
  '/fetch/wallet',
  handleRrequest
);
module.exports = router;
