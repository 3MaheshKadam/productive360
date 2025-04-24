import jwt from "jsonwebtoken";

export const verifyToken = async (req) => {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user to request object
    return null; // no error
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 403,
    });
  }
};

// { import { verifyToken } from "@/app/lib/verifyToken";

// export async function GET(req) {
//   const errorResponse = await verifyToken(req);
//   if (errorResponse) return errorResponse;

//   // req.user is now available here
//   return new Response(JSON.stringify({ data: "Protected content" }));
// }
// }
