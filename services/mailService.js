const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sendVerificationEmail = (email, verificationToken) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `<a href="${process.env.BACKEND_URL}/auth/verify/${verificationToken}">Verify Email</a>`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

const sendResetPasswordEmail = (email, resetToken) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<a href="${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}">Reset Password</a>`,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

module.exports = { sendVerificationEmail, sendResetPasswordEmail };
