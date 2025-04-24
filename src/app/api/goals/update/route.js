import connectDb from "@/app/lib/connectDb";
import { verifyToken } from "@/app/api/middleware/verifyToken";
import Goal from "@/app/models/goal.js";

export async function POST(req) {
  await connectDb();

  const auth = await verifyToken(req);
  if (auth.error) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
    });
  }

  const body = await req.json();
  const { _id, title, description, type, status, motivationQuote } = body;

  if (!_id) {
    return new Response(JSON.stringify({ error: "Goal ID is required" }), {
      status: 400,
    });
  }

  const goal = await Goal.findOne({ _id, userId: auth.userId });
  if (!goal) {
    return new Response(JSON.stringify({ error: "Goal not found" }), {
      status: 404,
    });
  }

  // Update only provided fields
  if (title !== undefined) goal.title = title;
  if (description !== undefined) goal.description = description;
  if (type !== undefined) goal.type = type;
  if (status !== undefined) goal.status = status;
  if (motivationQuote !== undefined) goal.motivationQuote = motivationQuote;

  await goal.save();

  return new Response(JSON.stringify({ message: "Goal updated", goal }), {
    status: 200,
  });
}
