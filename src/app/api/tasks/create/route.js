import connectDb from "@/app/lib/connectDb";
import Task from "@/app/models/task";
import Goal from "@/app/models/goal"; // Assuming you already have Goal model defined

export async function POST(req) {
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

    const { goalId, title, description, dueDate, priority } = body;

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Please provide a title for the task" }),
        { status: 400 }
      );
    }

    // Connect to DB
    await connectDb();

    // If goalId is provided, check if the goal exists
    if (goalId) {
      const goal = await Goal.findById(goalId);
      if (!goal) {
        return new Response(JSON.stringify({ error: "Goal not found" }), {
          status: 404,
        });
      }
    }

    // Create the new task
    const newTask = new Task({
      goalId,
      title,
      description,
      dueDate,
      priority,
    });

    // Save the task
    await newTask.save();

    return new Response(
      JSON.stringify({ message: "Task created successfully", task: newTask }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in creating task:", error);
    return new Response(
      JSON.stringify({ error: "Server error while creating task" }),
      { status: 500 }
    );
  }
}
