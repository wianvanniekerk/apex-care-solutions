
const { Vonage } = require('@vonage/server-sdk');
const vonage = new Vonage({
  apiKey: "1737878b",
  apiSecret: "DZOLCVirvvkialA8"
});

const from = "Vonage APIs";
const to = "27672276144";

async function sendSMS(text) {
  await vonage.sms.send({ to, from, text })
    .then(resp => { console.log('Message sent successfully'); console.log(resp); })
    .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

module.exports = { sendSMS };
