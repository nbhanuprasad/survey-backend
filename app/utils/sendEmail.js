var nodemailer = require('nodemailer');

exports.sendSurveyLinkEmail = async (userEmail, surveyLink) => {
  return await new Promise((resolve, reject) => {
    console.log(userEmail,surveyLink)
    let transporter = nodemailer.createTransport({
      name:"test",
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ocuproject2@gmail.com',
        pass: 'ABC@abc1234',
        clientId: '350533973281-gpjq3g2mvnqv9fur910g98ja4nfalkpb.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04Wr-Nu125TxDCgYIARAAGAQSNwF-L9Ir-xNFf4esxGiVK7zjX2P-oaFQd9QqanWaT3Xh1q2Yejd9XYRXcbf92GLuAMu9M2mLY5A'
      }
    });

    var mailOptions = {
      from: 'ocuproject2@gmail.com',
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
        console.log("Message sent: %s", info.accepted);

        resolve(true)
      }
    });
  })
}

