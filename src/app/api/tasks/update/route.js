import connectDb from "@/app/lib/connectDb";
import Task from "@/app/models/task";

export async function PUT(req) {
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

    if (!body) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
      });
    }

    const { taskId, title, description, dueDate, priority, status } = body;

    if (!taskId) {
      return new Response(JSON.stringify({ error: "Task ID is required" }), {
        status: 400,
      });
    }

    // Connect to DB
    await connectDb();

    // Find the task and update it
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        dueDate,
        priority,
        status, // Ensure status field is included here
      },
      { new: true } // This returns the updated task, not the original
    );

    if (!updatedTask) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Task updated successfully",
        task: updatedTask,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating task:", error);
    return new Response(
      JSON.stringify({ error: "Server error while updating task" }),
      { status: 500 }
    );
  }
}
