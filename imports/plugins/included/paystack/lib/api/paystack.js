import request from "request";
import _ from "underscore";

export const Paystack = {};

const paystackHeaders = (secret) => {
  return {
    "Authorization": `Bearer ${secret}`,
    "Content-Type": "application/json"
  };
};


Paystack.initialize = (object, secret, cb) => {
  const headers = paystackHeaders(secret);
  const url = "https://api.paystack.co/transaction/initialize";
  const jsonBody = _.pick(object, ["amount", "reference", "callback_url", "name", "email"]);
  request.post(url, {form: jsonBody, headers }, (err, response, body) =>  {
    const res = JSON.parse(body);
    if (res.status) {
      cb(null, res);
    } else {
      cb(res, null);
    }
  });
};

Paystack.verify = (reference, secret, cb) => {
  const headers = paystackHeaders(secret);
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  request.get(url, { headers }, (err, response, body) =>  {
    const res = JSON.parse(body);
    if (res.status) {
      cb(null, res);
    } else {
      cb(res, null);
    }
  });
};
