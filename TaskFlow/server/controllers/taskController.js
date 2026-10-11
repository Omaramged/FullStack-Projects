const mongoose = require("mongoose");
const Task = require("../models/Task");

async function getTasks(req, res) {
  try {
    const { search, status, priority } = req.query;
    let filter = { user: req.userId };

    if (status === "todo" || status === "in_progress" || status === "done") {
      filter.status = status;
    }

    if (priority === "low" || priority === "medium" || priority === "high") {
      filter.priority = priority;
    }

    if (search && search.trim() !== "") {
      const safe = search.trim().slice(0, 50);
      filter.title = { $regex: safe, $options: "i" };
    }

    const tasks = await Task.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function getTask(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid task id" });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.userId });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function createTask(req, res) {
  try {
    let { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    title = title.trim();

    if (title.length > 100) {
      return res.status(400).json({ success: false, message: "Title is too long" });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({ success: false, message: "Description is too long" });
    }

    if (status && status !== "todo" && status !== "in_progress" && status !== "done") {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    if (priority && priority !== "low" && priority !== "medium" && priority !== "high") {
      return res.status(400).json({ success: false, message: "Invalid priority" });
    }

    const task = await Task.create({
      title,
      description: description || "",
      status: status || "todo",
      priority: priority || "medium",
      dueDate: dueDate || null,
      user: req.userId,
    });

    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function updateTask(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid task id" });
    }

    const { title, description, status, priority, dueDate } = req.body;
    let update = {};

    if (title !== undefined) {
      if (title.trim() === "") {
        return res.status(400).json({ success: false, message: "Title cannot be empty" });
      }
      if (title.trim().length > 100) {
        return res.status(400).json({ success: false, message: "Title is too long" });
      }
      update.title = title.trim();
    }

    if (description !== undefined) {
      if (description.length > 1000) {
        return res.status(400).json({ success: false, message: "Description is too long" });
      }
      update.description = description;
    }

    if (status !== undefined) {
      if (status !== "todo" && status !== "in_progress" && status !== "done") {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
      update.status = status;
    }

    if (priority !== undefined) {
      if (priority !== "low" && priority !== "medium" && priority !== "high") {
        return res.status(400).json({ success: false, message: "Invalid priority" });
      }
      update.priority = priority;
    }

    if (dueDate !== undefined) {
      update.dueDate = dueDate || null;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      update,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

async function deleteTask(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid task id" });
    }

    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json({ success: true, data: "Task deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
