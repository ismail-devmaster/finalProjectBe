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

const generateVerificationToken = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

module.exports = { generateTokens, generateVerificationToken };
