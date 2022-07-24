var nodemailer = require('nodemailer');

exports.sendSurveyLinkEmail = async (userEmail, surveyLink) => {
  return await new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: '',
        pass: '',
        clientId: '',
        clientSecret: '',
        refreshToken: ''
      }
    });

    var mailOptions = {
      from: '',
      to: userEmail,
      subject: 'Complete Survey',
      text: surveyLink
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        resolve(false)
      } else {
        console.log("here")
        resolve(true)
      }
    });
  })
}

