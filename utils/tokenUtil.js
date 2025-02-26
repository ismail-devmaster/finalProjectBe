const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", 
  });
  const refreshToken = jwt.sign(
    { userId, role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" } 
  );
  return { accessToken, refreshToken };
};

const generateVerificationToken = (userId) => {
  return jwt.sign({ userId }, process.env.EMAIL_VERIFICATION_SECRET, {
    expiresIn: "1h", // Expire in 1 hour
  });
};

module.exports = { generateTokens, generateVerificationToken };
