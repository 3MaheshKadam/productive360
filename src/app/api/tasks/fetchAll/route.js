import connectDb from "@/app/lib/connectDb";
import Task from "@/app/models/task";
import { verifyToken } from "@/app/api/middleware/verifyToken";

export async function GET(req) {
  try {
    const verifiedUser = await verifyToken(req);
    if (!verifiedUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Connect to DB
    await connectDb();

    // Fetch all tasks for the user
    const tasks = await Task.find({ userId: verifiedUser._id }).sort({
      createdAt: -1,
    });

    return new Response(
      JSON.stringify({ message: "Tasks fetched successfully", tasks }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in fetching tasks:", error);
    return new Response(
      JSON.stringify({ error: "Server error while fetching tasks" }),
      { status: 500 }
    );
  }
}
