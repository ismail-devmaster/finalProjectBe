const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email provider (e.g., Gmail, Outlook, etc.)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const verificationLink = `http://localhost:4000/api/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text:
      `Please click the following link to verify your email: ${verificationLink}`,
    html:
      `<p>Please click the following link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
}

module.exports = { sendVerificationEmail };
