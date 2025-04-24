import jwt from "jsonwebtoken";

export const verifyToken = async (req) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authorization token missing or invalid");
    return { error: "Authorization token is missing or invalid", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully");
    return { userId: decoded.userId }; // Token is valid, return userId
  } catch (err) {
    console.log("Token verification failed: Invalid or expired token");
    return {
      error: "Token verification failed. Invalid or expired token",
      status: 401,
    };
  }
};
