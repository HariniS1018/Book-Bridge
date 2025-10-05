import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET_KEY;

const authenticateToken = (req, res, next) => {
  console.log("Auth middleware triggered");


  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.error("Token invalid or expired. JWT Verification Error:", err);
      return res.sendStatus(403); // If the token is invalid or expired, return 403 Forbidden
    }

    req.user = user; // Attach the decoded payload (user data) to the request object
    console.log("Authenticated user:", user);

    next(); // Continue to the next middleware or route handler
  });
};

export { authenticateToken };
