const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const prisma = require("./database");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const nameParts = profile.displayName.split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
          return done(null, user);
        }

        // If user does not exist, generate a temporary token with Google info.
        const tempTokenPayload = {
          email,
          firstName,
          lastName,
          googleId: profile.id,
        };

        const tempToken = jwt.sign(
          tempTokenPayload,
          process.env.JWT_TEMP_SECRET,
          { expiresIn: "10m" }
        );

        return done(null, { tempToken, isNewUser: true });
      } catch (error) {
        console.error("Error during Google auth:", error);
        done(error);
      }
    }
  )
);

module.exports = passport;
