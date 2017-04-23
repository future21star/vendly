/**
 * Created by Adam on 3/30/17.
 */

let providers = {
  sendgrid: require("./sendgridMailer")
};

module.exports = function (provider = "sendgrid") {
  return providers[provider]
};
