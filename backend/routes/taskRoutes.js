const express = require("express");

const router = express.Router();

const {
createTask,
getTasks,
getTaskById,
updateTask,
deleteTask,
} = require("../controllers/taskControllers");

// Create Task
router.post("/", createTask);

// Get All Tasks
router.get("/", getTasks);

// Get Single Task
router.get("/:id", getTaskById);

// Update Task
router.put("/:id", updateTask);

// Delete Task
router.delete("/:id", deleteTask);

module.exports = router;
