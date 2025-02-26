const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, token) {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Welcome to Our Platform!</h2>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationLink}" 
           style="display: inline-block; padding: 10px 20px; background-color: #007bff; 
                  color: white; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>If you didn’t request this, you can ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
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
