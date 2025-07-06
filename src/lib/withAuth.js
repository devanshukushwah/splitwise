// lib/withAuth.js
import jwt from "jsonwebtoken";

// Secret key to validate the JWT (use a secure value in production)
const JWT_SECRET = process.env.JWT_SECRET || "secret-nahi-hai";

export function withAuth(handler) {
  return async (req, ...rest) => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({
            message: "Missing or invalid Authorization header",
          }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const token = authHeader.split(" ")[1];

      // Verify JWT token
      const payload = jwt.verify(token, JWT_SECRET);

      // Optionally attach user info to the request
      req.user = payload;

      // Continue to handler
      return handler(req, ...rest);
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Unauthorized or invalid token" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
}
