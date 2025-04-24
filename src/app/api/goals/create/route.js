import connectDb from "@/app/lib/connectDb";
import { verifyToken } from "@/app/api/middleware/verifyToken";
import Goal from "@/app/models/goal.js";

export async function POST(req) {
  await connectDb();

  // Verify the user's token
  const auth = await verifyToken(req);
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
    });
  }

  const body = await req.json();
  const { title, description, type, status, motivationQuote } = body;

  // Check if title is provided
  if (!title) {
    return new Response(JSON.stringify({ error: "Title is required" }), {
      status: 400,
    });
  }

  // Check if a goal with the same title already exists for the user
  const existingGoal = await Goal.findOne({ userId: auth.userId, title });
  if (existingGoal) {
    return new Response(
      JSON.stringify({ error: "A goal with the same title already exists" }),
      {
        status: 400,
      }
    );
  }

  // Create the new goal
  const goal = new Goal({
    userId: auth.userId,
    title,
    description,
    type,
    status,
    motivationQuote,
  });

  // Save the goal to the database
  await goal.save();

  return new Response(JSON.stringify({ message: "Goal created", goal }), {
    status: 201,
  });
}
