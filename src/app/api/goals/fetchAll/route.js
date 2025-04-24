import connectDb from "@/app/lib/connectDb";
import { verifyToken } from "@/app/api/middleware/verifyToken";
import Goal from "@/app/models/goal.js";
export async function GET(req) {
  await connectDb();

  // Verify the user's token
  const auth = await verifyToken(req);
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
    });
  }

  // Fetch all goals for the authenticated user
  try {
    const goals = await Goal.find({ userId: auth.userId });
    return new Response(JSON.stringify({ goals }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error fetching goals", details: error.message }),
      { status: 500 }
    );
  }
}
