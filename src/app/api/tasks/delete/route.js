import connectDb from "@/app/lib/connectDb";
import Task from "@/app/models/task";

export async function DELETE(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new Response(
        JSON.stringify({ error: "Expected application/json" }),
        { status: 400 }
      );
    }

    const body = await req.json().catch((err) => {
      console.error("Invalid JSON body:", err);
      return null;
    });

    if (!body || !body.taskId) {
      return new Response(JSON.stringify({ error: "Task ID is required" }), {
        status: 400,
      });
    }

    const { taskId } = body;

    // Connect to DB
    await connectDb();

    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Task deleted successfully",
        task: deletedTask,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting task:", error);
    return new Response(
      JSON.stringify({ error: "Server error while deleting task" }),
      { status: 500 }
    );
  }
}
