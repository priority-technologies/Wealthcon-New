import AWS from "aws-sdk";
import nodemailer from "nodemailer";

export const sendEmailBySES = async (email, otp) => {
  let subject = "Wealthcon Password Reset Request - OTP Inside";
  let template = `<body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
                          <div style="max-width: 570px;">
                              <p>Hello,</p>
                              <p>Your One Time Password (OTP) is:</p>
                              <div style="position: relative; display: flex; padding: 20px; font-size: 16px; color: #333; background-color: #f1f1f1; border-radius: 10px; margin-top: 20px;">
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-spacing: 0;">
                                    <tr style="padding: 20px; background-color: #f1f1f1; border-radius: 10px;">
                                        <td style="text-align: center;">
                                            <div style="display: inline-block; padding: 20px; font-size: 32px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 10px; margin-bottom: 10px;">
                                                ${otp}
                                            </div>
                                        </td>
                                    </tr>
                                  </table>
                              </div>
                              <p>This OTP is valid for the next 2 minutes. Please use it to reset your password.</p>
                              <p>If you did not request a password reset, please ignore this email.</p>
                              <p>Thank you!</p>
                              <p style="margin-top: 20px; font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
                          </div>
                      </body>
                    `;
  const config = {
    accessKeyId: process.env.SMTP_USER_NAME,
    secretAccessKey: process.env.SMTP_PASSWORD,
    region: process.env.SMTP_REGION,
  };

  const ses = new AWS.SES(config);

  const params = {
    Source: `"Wealthcon 👻" <${process.env.SMTP_DOMAIN}>`,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data: template,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    return true;
    // console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error("Send mail error ===> ", error.message);
    return false;
  }
};

// Send One time password for email verification
export const sendEmailByNodeMailer = async (email, otp) => {
  try {
    let subject = "Wealthcon Password Reset Request - OTP Inside";
    let template = `<body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
                          <div style="max-width: 570px;">
                              <p>Hello,</p>
                              <p>Your One Time Password (OTP) is:</p>
                              <div style="position: relative; display: flex; padding: 20px; font-size: 16px; color: #333; background-color: #f1f1f1; border-radius: 10px; margin-top: 20px;">
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; border-spacing: 0;">
                                    <tr style="padding: 20px; background-color: #f1f1f1; border-radius: 10px;">
                                        <td style="text-align: center;">
                                            <div style="display: inline-block; padding: 20px; font-size: 32px; font-weight: bold; color: #fff; background-color: #007bff; border-radius: 10px; margin-bottom: 10px;">
                                                ${otp}
                                            </div>
                                        </td>
                                    </tr>
                                  </table>
                              </div>
                              <p>This OTP is valid for the next 2 minutes. Please use it to reset your password.</p>
                              <p>If you did not request a password reset, please ignore this email.</p>
                              <p>Thank you!</p>
                              <p style="margin-top: 20px; font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
                          </div>
                      </body>
                    `;

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Message object
    var message = {
      from: `"Wealthcon 👻" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: template,
    };

    await transport.sendMail(message);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Send mail error ===> ", error.message);
    return false;
  }
};
