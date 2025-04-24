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

  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ error: "Goal ID is required" }), {
      status: 400,
    });
  }

  const deleted = await Goal.findOneAndDelete({ _id: id, userId: auth.userId });

  if (!deleted) {
    return new Response(
      JSON.stringify({ error: "Goal not found or not authorized" }),
      {
        status: 404,
      }
    );
  }

  return new Response(
    JSON.stringify({ message: "Goal deleted successfully" }),
    {
      status: 200,
    }
  );
}
