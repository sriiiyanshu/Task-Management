import express from "express";
import prisma from "../config/database.js";

const router = express.Router();

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the authenticated user with filtering and search
 * @access  Private
 * @query   status - Filter by task status (To Do, In Progress, Done)
 * @query   search - Search in title and description
 * @query   priority - Filter by priority (Low, Medium, High)
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, priority } = req.query;

    // Build filter conditions
    const where = {
      userId,
    };

    // Add status filter if provided
    if (status) {
      where.status = status;
    }

    // Add priority filter if provided
    if (priority) {
      where.priority = priority;
    }

    // Add search filter if provided (searches in title and description)
    if (search) {
      where.OR = [{ title: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }];
    }

    // Fetch tasks with filters
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      error: "ServerError",
      message: "Failed to fetch tasks",
    });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 * @body    title (required), description, dueDate, priority, status
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, dueDate, priority, status } = req.body;

    // Validate required fields
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Title is required",
      });
    }

    // Validate priority if provided
    const validPriorities = ["Low", "Medium", "High"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Priority must be one of: Low, Medium, High",
      });
    }

    // Validate status if provided
    const validStatuses = ["To Do", "In Progress", "Done"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Status must be one of: To Do, In Progress, Done",
      });
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "Medium",
        status: status || "To Do",
        userId,
      },
    });

    console.log(`✅ Task created: "${task.title}" by user ${userId}`);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("❌ Error creating task:", error);

    if (error.message.includes("Invalid date")) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Invalid date format for dueDate",
      });
    }

    res.status(500).json({
      success: false,
      error: "ServerError",
      message: "Failed to create task",
    });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private (owner only)
 * @params  id - Task ID
 * @body    title, description, dueDate, priority, status
 */
router.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);
    const { title, description, dueDate, priority, status } = req.body;

    // Validate task ID
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Invalid task ID",
      });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "NotFound",
        message: "Task not found",
      });
    }

    // Security: Verify ownership
    if (existingTask.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You don't have permission to update this task",
      });
    }

    // Validate priority if provided
    const validPriorities = ["Low", "Medium", "High"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Priority must be one of: Low, Medium, High",
      });
    }

    // Validate status if provided
    const validStatuses = ["To Do", "In Progress", "Done"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Status must be one of: To Do, In Progress, Done",
      });
    }

    // Build update data (only include provided fields)
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    console.log(`✅ Task updated: "${updatedTask.title}" by user ${userId}`);

    res.json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("❌ Error updating task:", error);

    if (error.message.includes("Invalid date")) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Invalid date format for dueDate",
      });
    }

    res.status(500).json({
      success: false,
      error: "ServerError",
      message: "Failed to update task",
    });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private (owner only)
 * @params  id - Task ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);

    // Validate task ID
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Invalid task ID",
      });
    }

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!existingTask) {
      return res.status(404).json({
        success: false,
        error: "NotFound",
        message: "Task not found",
      });
    }

    // Security: Verify ownership
    if (existingTask.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You don't have permission to delete this task",
      });
    }

    // Delete task
    await prisma.task.delete({
      where: { id: taskId },
    });

    console.log(`✅ Task deleted: "${existingTask.title}" by user ${userId}`);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({
      success: false,
      error: "ServerError",
      message: "Failed to delete task",
    });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Private (owner only)
 * @params  id - Task ID
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id);

    // Validate task ID
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        error: "ValidationError",
        message: "Invalid task ID",
      });
    }

    // Fetch task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "NotFound",
        message: "Task not found",
      });
    }

    // Security: Verify ownership
    if (task.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "You don't have permission to view this task",
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("❌ Error fetching task:", error);
    res.status(500).json({
      success: false,
      error: "ServerError",
      message: "Failed to fetch task",
    });
  }
});

export default router;
