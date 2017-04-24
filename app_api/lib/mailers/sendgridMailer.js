/**
 * Created by Adam on 3/30/17.
 */
let helper = require("sendgrid").mail;

module.exports = {
  send: function(options, callback) {
    // Todo: check presence of required params
    let to = new helper.Email(options.to);
    let from = new helper.Email(options.from);
    let content = new helper.Content('text/plain', options.body);
    let mail = new helper.Mail(from, options.subject, to, content);

    let sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
    let request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
      console.log(response.statusCode);
      callback(error, response);
    });
  }
};