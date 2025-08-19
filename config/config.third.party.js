const fs = require('fs');

const riaPublicKey = fs.readFileSync('public/publickey.key', 'utf8');
const clientCertificate = fs.readFileSync('public/certificate.crt', 'utf8');

module.exports = {
  stagingUrl: "https://enprepaid.eftapme.com/riaapiUAT/mainRequest",
  partitionId: "RIA",
  channelId: "DOTLINE",
  channelPassword: "Secure@2024*",
  encryption: {
    riaPublicKey,
    clientCertificate
  },
};
