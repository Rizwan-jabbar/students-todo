import Task from "../../models/taskSchema/taskSchema.js";

export const addTodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ isSuccess: false, message: "Title is required" });
  }


  const userId = req.user?.id; // middleware se attach hua

  if (!userId) {
    return res.status(400).json({ isSuccess: false, message: "Invalid user" });
  }

  try {
    // Save task in DB
    const newTask = await Task.create({ title, description, userId });

    return res.status(201).json({ isSuccess: true, task: newTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ isSuccess: false, message: "Server error" });
  }
};



export const getTodos = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ isSuccess: false, message: "Unauthorized user" });
  }

  try {
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ isSuccess: true, tasks });
  } catch (error) {
    console.error("GET TODOS ERROR:", error);
    return res.status(500).json({ isSuccess: false, message: "Server error" });
  }
};


//  here to delete a todo

export const deleteTodo = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user?.id; // from auth middleware

  if (!userId) {
    return res.status(401).json({ isSuccess: false, message: 'Unauthorized user' });
  }

  if (!taskId) {
    return res.status(400).json({ isSuccess: false, message: 'Task ID is required' });
  }

  try {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ isSuccess: false, message: 'Task not found' });
    }

    await Task.deleteOne({ _id: taskId });

    return res.status(200).json({ isSuccess: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({ isSuccess: false, message: 'Server error' });
  }
};


export const updateTodo = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        isSuccess: false,
        message: "Unauthorized user",
      });
    }

    if (!taskId) {
      return res.status(400).json({
        isSuccess: false,
        message: "Task ID is required",
      });
    }

    // Check if task belongs to user
    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({
        isSuccess: false,
        message: "Task not found",
      });
    }

    // Only allow specific fields to update (security best practice)
    const { title, description, completed } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();

    return res.status(200).json({
      isSuccess: true,
      message: "Task updated successfully",
      task: updatedTask,
    });

  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
  }
};
